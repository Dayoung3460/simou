import sharp from "sharp";

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  blurDataURL: string;
};

const MAX_DIMENSION = 2000;

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
    buffer,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString("base64")}`,
  };
}
