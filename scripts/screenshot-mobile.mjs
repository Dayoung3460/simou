/**
 * 모바일(390px, 아이폰 기준) 에뮬레이션 스크린샷 + 가로 오버플로우 검증.
 *
 * 헤드리스 데스크톱 Chrome은 최소 창 폭이 ~500px라 --window-size=390이 무시된다.
 * 그래서 CDP의 Emulation.setDeviceMetricsOverride로 진짜 모바일 뷰포트를 에뮬레이션한다.
 * (자세한 배경은 claude.md의 "검증 노하우" 참고)
 *
 * 사용법:
 *   npm run dev (또는 npx next start) 로 서버를 먼저 띄운 뒤
 *   npm run screenshots                          # 기본 http://localhost:3000
 *   npm run screenshots -- http://localhost:3007 # 다른 포트
 *
 * 결과: .screenshots/*.png (gitignore됨)
 * 가로 오버플로우(scrollWidth > 390)가 발견되면 exit code 1로 종료한다.
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

// Reveal(IntersectionObserver)이 발화하도록 페이지 전체를 훑고 맨 위로 복귀
const AUTOSCROLL = `(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
})()`;

// [이름, 경로, 캡처 전 실행할 JS, 풀페이지 여부]
// 오버레이(메뉴/라이트박스)는 뷰포트 캡처, 나머지는 auto-scroll 후 풀페이지 캡처
const PAGES = [
  ["home", "/", AUTOSCROLL, true],
  ["home-menu", "/", `document.querySelector('button[aria-label="메뉴 열기"]')?.click()`, false],
  ["portfolio", "/portfolio", AUTOSCROLL, true],
  ["portfolio-lightbox", "/portfolio", `document.querySelector('button.cursor-zoom-in')?.click()`, false],
  ["portfolio-campus", "/portfolio?category=campus", AUTOSCROLL, true],
  ["pricing", "/pricing", AUTOSCROLL, true],
  ["about", "/about", AUTOSCROLL, true],
  ["contact", "/contact", AUTOSCROLL, true],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 대상 서버 살아있는지 먼저 확인
try {
  await fetch(BASE);
} catch {
  console.error(`서버(${BASE})에 연결할 수 없습니다. 먼저 npm run dev 또는 npx next start로 서버를 실행하세요.`);
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
  // devtools 엔드포인트 대기
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
    await sleep(3500); // 로드 + 하이드레이션

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
      `${ok ? "✓" : "✗ 가로 오버플로우!"} ${name} (scrollWidth=${scrollWidth})`,
    );

    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: fullPage,
    });
    await writeFile(path.join(OUT, `${name}.png`), Buffer.from(shot.data, "base64"));
    ws.close();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${targetId}`).catch(() => {});
  }

  console.log(`\n스크린샷 저장 위치: ${path.relative(root, OUT)}/`);
} finally {
  chrome.kill();
}

process.exit(overflowFound ? 1 : 0);
