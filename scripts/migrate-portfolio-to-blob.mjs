// One-off migration: uploads the existing public/images/portfolio/* photos to Vercel Blob
// and writes the initial portfolio/manifest.json. Run once, manually, after BLOB_READ_WRITE_TOKEN
// is set locally (`vercel env pull .env.local`). Not part of the running app.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");

// Snapshot of the pre-migration src/data/portfolio.ts, in the same hand-curated interleave order
const photos = [
  { id: "field-05", category: "field", alt: "들판에서 서로에게 기대어 입맞추는 신랑과 신부, 흑백" },
  { id: "campus-01", category: "campus", alt: "붉은 벽돌 건물 앞에서 레드 부케를 든 신랑과 신부" },
  { id: "forest-01", category: "forest", alt: "들꽃 핀 정원 길을 걷는 신랑과 신부" },
  { id: "city-01", category: "city", alt: "빗속 자동차 앞에서의 흑백 시티 스냅" },
  { id: "field-01", category: "field", alt: "물가 수풀에 앉아 부케를 든 신부" },
  { id: "campus-03", category: "campus", alt: "빨간 공중전화 부스 앞의 신랑과 신부" },
  { id: "forest-02", category: "forest", alt: "소나무 아래에서 베일이 바람에 날리는 신부" },
  { id: "city-02", category: "city", alt: "도시의 밤, 도로 위에서 입맞추는 흑백 스냅" },
  { id: "field-02", category: "field", alt: "초원에서 손을 잡고 걷는 신랑과 신부" },
  { id: "campus-02", category: "campus", alt: "벽돌 캠퍼스를 배경으로 나란히 선 신랑과 신부" },
  { id: "forest-03", category: "forest", alt: "공원에서 부케를 든 신부와 신랑의 투컷" },
  { id: "field-03", category: "field", alt: "들꽃 부케를 들고 서로 기댄 블랙 드레스의 신부와 신랑" },
  { id: "campus-04", category: "campus", alt: "벽돌 건물 입구에서 마주 보는 신랑과 신부" },
  { id: "forest-04", category: "forest", alt: "잔디밭에서 그린 톤 부케를 든 신랑" },
  { id: "field-04", category: "field", alt: "수풀 들판에 나란히 선 신랑과 신부" },
];

const featuredIds = new Set([
  "field-05",
  "campus-01",
  "forest-02",
  "city-02",
  "field-01",
  "campus-03",
  "forest-01",
  "city-01",
]);

async function processImage(inputBuffer) {
  const pipeline = sharp(inputBuffer).rotate().resize({
    width: 2000,
    height: 2000,
    fit: "inside",
    withoutEnlargement: true,
  });
  const { data: buffer, info } = await pipeline.jpeg({ quality: 85 }).toBuffer({ resolveWithObject: true });
  const blurBuffer = await sharp(buffer).resize(16).jpeg({ quality: 40 }).toBuffer();
  return { buffer, width: info.width, height: info.height, blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString("base64")}` };
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set — run `vercel env pull .env.local` first");
  }

  const manifestPhotos = [];

  for (const [order, photo] of photos.entries()) {
    const filePath = path.join(root, "public/images/portfolio", photo.category, `${photo.id}.jpg`);
    const input = await readFile(filePath);
    const { buffer, width, height, blurDataURL } = await processImage(input);

    const blob = await put(`portfolio/${photo.category}/${photo.id}.jpg`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/jpeg",
    });

    manifestPhotos.push({
      id: photo.id,
      url: blob.url,
      width,
      height,
      blurDataURL,
      alt: photo.alt,
      category: photo.category,
      featured: featuredIds.has(photo.id),
      order,
    });

    console.log(`Uploaded ${photo.id} -> ${blob.url}`);
  }

  await put("portfolio/manifest.json", JSON.stringify({ version: 1, photos: manifestPhotos }), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: process.env.MANIFEST_BLOB_READ_WRITE_TOKEN,
  });

  console.log(`\nManifest written with ${manifestPhotos.length} photos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
