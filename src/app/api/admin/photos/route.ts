import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isUploadableCategory } from "@/data/portfolio";
import { isAuthenticated } from "@/lib/auth";
import { readManifestForMutation, writeManifest, type ManifestPhoto } from "@/lib/blob-store";
import { processPortfolioImage } from "@/lib/image-processing";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const category = formData.get("category");
  if (!isUploadableCategory(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "no files provided" }, { status: 400 });
  }
  if (files.some((f) => !f.type.startsWith("image/"))) {
    return NextResponse.json({ error: "only image files are accepted" }, { status: 400 });
  }

  let manifest;
  try {
    manifest = await readManifestForMutation();
  } catch {
    return NextResponse.json({ error: "could not read current manifest, try again" }, { status: 500 });
  }
  let nextOrder = manifest.photos.reduce((max, p) => Math.max(max, p.order), -1) + 1;

  const newPhotos: ManifestPhoto[] = [];
  for (const file of files) {
    const id = randomUUID();
    const input = Buffer.from(await file.arrayBuffer());
    const { buffer, width, height, blurDataURL } = await processPortfolioImage(input);
    const blob = await put(`portfolio/${category}/${id}.jpg`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/jpeg",
    });

    newPhotos.push({
      id,
      url: blob.url,
      width,
      height,
      blurDataURL,
      alt: "",
      category,
      featured: false,
      order: nextOrder++,
    });
  }

  manifest.photos.push(...newPhotos);
  await writeManifest(manifest);

  return NextResponse.json({ photos: newPhotos }, { status: 201 });
}
