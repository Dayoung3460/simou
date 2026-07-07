/**
 * [Retired] Generator script from the placeholder era, before real photos arrived.
 *
 * ⚠️ Running this now overwrites the "real photos" in public/images/hero,
 * public/images/about, and public/og.png with gradient placeholders. Don't run it.
 * (Kept for reference only. Also removed from npm scripts — 2026-07-07)
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = (...p) => path.join(root, "public", ...p);

// Warm-tone gradient palette per category (top → bottom)
const PORTFOLIO = {
  forest: [
    ["#a3aa9a", "#7f8676"],
    ["#969e90", "#727a6c"],
    ["#adb2a4", "#878c7e"],
    ["#9aa392", "#747d6c"],
  ],
  field: [
    ["#d1c5ad", "#ac9f83"],
    ["#c8bba1", "#a2957b"],
    ["#d8cdb8", "#b2a792"],
    ["#cbbfa6", "#a59980"],
  ],
  lake: [
    ["#adb8bc", "#879296"],
    ["#a2aeb4", "#7c888e"],
    ["#b6bec2", "#90989c"],
    ["#a8b2b8", "#828c92"],
  ],
  sea: [
    ["#9dabb6", "#778590"],
    ["#93a2ae", "#6d7c88"],
    ["#a6b2bc", "#808c96"],
    ["#98a6b0", "#72808a"],
  ],
  indoor: [
    ["#c6bab0", "#a0948a"],
    ["#bcafa3", "#96897d"],
    ["#cec3b9", "#a89d93"],
    ["#c1b5a9", "#9b8f83"],
  ],
};

// Mix portrait ratios so the masonry grid looks natural
const RATIOS = [
  [1200, 1600], // 3:4
  [1200, 1800], // 2:3
  [1280, 1600], // 4:5
  [1200, 1500], // 4:5
];

function gradientSvg(w, h, [top, bottom]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="light" cx="0.32" cy="0.22" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#light)"/>
</svg>`;
}

async function writeJpeg(svg, file) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 72, mozjpeg: true }).toFile(file);
  console.log("✓", path.relative(root, file));
}

// Portfolio: 4 photos per category
for (const [category, palettes] of Object.entries(PORTFOLIO)) {
  const dir = out("images", "portfolio", category);
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < palettes.length; i++) {
    const [w, h] = RATIOS[i % RATIOS.length];
    const file = path.join(dir, `${category}-${String(i + 1).padStart(2, "0")}.jpg`);
    await writeJpeg(gradientSvg(w, h, palettes[i]), file);
  }
}

// Hero (landscape)
await mkdir(out("images", "hero"), { recursive: true });
await writeJpeg(gradientSvg(2400, 1500, ["#b6b0a2", "#8f887a"]), out("images", "hero", "hero-01.jpg"));
await writeJpeg(gradientSvg(2400, 1600, ["#a9aea6", "#82877f"]), out("images", "hero", "hero-02.jpg"));

// About
await mkdir(out("images", "about"), { recursive: true });
await writeJpeg(gradientSvg(1400, 1750, ["#c2b9a9", "#9c9383"]), out("images", "about", "about-01.jpg"));
await writeJpeg(gradientSvg(1600, 1200, ["#b3aca0", "#8d867a"]), out("images", "about", "about-02.jpg"));

// OG image (1200x630)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fdfcfa"/>
  <text x="614" y="308" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="92" letter-spacing="28" fill="#1a1a1a">SIMOU</text>
  <rect x="560" y="356" width="80" height="1" fill="#c9c4bc"/>
  <text x="605" y="412" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="21" letter-spacing="10" fill="#8a8580">WEDDING SNAP</text>
</svg>`;
await sharp(Buffer.from(ogSvg)).png().toFile(out("og.png"));
console.log("✓ public/og.png");

console.log("\nPlaceholder images generated");
