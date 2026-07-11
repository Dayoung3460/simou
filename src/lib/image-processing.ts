import { types } from "util";
import sharp from "sharp";

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  blurDataURL: string;
};

const MAX_DIMENSION = 2000;

let warnedWasmFallback = false;

/**
 * sharp's wasm32 fallback (used silently when the native binary fails to load) returns Buffers
 * that view its shared WebAssembly heap. fetch — and therefore @vercel/blob's put() — rejects
 * SharedArrayBuffer-backed bodies ("ArrayBuffer: SharedArrayBuffer is not allowed"), so copy the
 * bytes into ordinary memory before they can reach a network call.
 */
function offSharedHeap(buffer: Buffer): Buffer {
  if (!types.isSharedArrayBuffer(buffer.buffer)) return buffer;
  if (!warnedWasmFallback) {
    warnedWasmFallback = true;
    console.warn(
      "sharp is running on its wasm32 fallback — the native binary failed to load on this runtime",
    );
  }
  return Buffer.from(buffer);
}

/** Re-encodes to JPEG (strips EXIF), caps the long edge at 2000px, and derives a blur placeholder */
export async function processPortfolioImage(input: Buffer): Promise<ProcessedImage> {
  const pipeline = sharp(input).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  const { data: buffer, info } = await pipeline
    .jpeg({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const blurBuffer = await sharp(buffer).resize(16).jpeg({ quality: 40 }).toBuffer();

  return {
    buffer: offSharedHeap(buffer),
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString("base64")}`,
  };
}
