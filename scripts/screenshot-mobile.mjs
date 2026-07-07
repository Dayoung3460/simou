/**
 * Mobile (390px, iPhone-sized) emulated screenshots + horizontal overflow check.
 *
 * Headless desktop Chrome has a minimum window width of ~500px, so
 * --window-size=390 gets ignored. Instead, this emulates a genuine mobile
 * viewport via CDP's Emulation.setDeviceMetricsOverride.
 * (See the "Verification Notes" section of claude.md for the full background.)
 *
 * Usage:
 *   Start the server first with npm run dev (or npx next start), then:
 *   npm run screenshots                          # defaults to http://localhost:3000
 *   npm run screenshots -- http://localhost:3007 # a different port
 *
 * Output: .screenshots/*.png (gitignored)
 * Exits with code 1 if horizontal overflow (scrollWidth > 390) is found.
 */
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const VIEWPORT = { width: 390, height: 844 };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, ".screenshots");

// Sweep the whole page so Reveal (IntersectionObserver) fires, then return to the top
const AUTOSCROLL = `(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
})()`;

// [name, path, JS to run before capture, full-page flag]
// Overlays (menu/lightbox) get a viewport capture; everything else gets a full-page capture after auto-scroll
const PAGES = [
  ["home", "/", AUTOSCROLL, true],
  ["home-menu", "/", `document.querySelector('button[aria-label="메뉴 열기"]')?.click()`, false],
  // Menu over a solid (backdrop-blur) header — catches fixed-overlay containing-block regressions
  ["pricing-menu", "/pricing", `document.querySelector('button[aria-label="메뉴 열기"]')?.click()`, false],
  ["portfolio", "/portfolio", AUTOSCROLL, true],
  ["portfolio-lightbox", "/portfolio", `document.querySelector('button.cursor-zoom-in')?.click()`, false],
  ["portfolio-campus", "/portfolio?category=campus", AUTOSCROLL, true],
  ["pricing", "/pricing", AUTOSCROLL, true],
  ["about", "/about", AUTOSCROLL, true],
  ["contact", "/contact", AUTOSCROLL, true],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Confirm the target server is up first
try {
  await fetch(BASE);
} catch {
  console.error(`Could not connect to server (${BASE}). Start it first with npm run dev or npx next start.`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const profile = await mkdtemp(path.join(os.tmpdir(), "simou-cdp-"));

const chrome = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function connect(url) {
  const created = await fetch(`http://127.0.0.1:${PORT}/json/new?${url}`, {
    method: "PUT",
  });
  const target = await created.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ws, send, targetId: target.id };
}

let overflowFound = false;

try {
  // Wait for the devtools endpoint
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) break;
    } catch {}
  }

  for (const [name, pagePath, preScript, fullPage] of PAGES) {
    const { ws, send, targetId } = await connect(BASE + pagePath);
    await send("Emulation.setDeviceMetricsOverride", {
      ...VIEWPORT,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(3500); // load + hydration

    if (preScript) {
      await send("Runtime.evaluate", { expression: preScript, awaitPromise: true });
      await sleep(1000);
    }

    const metrics = await send("Runtime.evaluate", {
      expression: "document.documentElement.scrollWidth",
      returnByValue: true,
    });
    const scrollWidth = metrics?.result?.value;
    const ok = scrollWidth <= VIEWPORT.width;
    if (!ok) overflowFound = true;
    console.log(
      `${ok ? "✓" : "✗ Horizontal overflow!"} ${name} (scrollWidth=${scrollWidth})`,
    );

    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: fullPage,
    });
    await writeFile(path.join(OUT, `${name}.png`), Buffer.from(shot.data, "base64"));
    ws.close();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${targetId}`).catch(() => {});
  }

  console.log(`\nScreenshots saved to: ${path.relative(root, OUT)}/`);
} finally {
  chrome.kill();
}

process.exit(overflowFound ? 1 : 0);
