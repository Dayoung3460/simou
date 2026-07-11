import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isUploadableCategory } from "@/data/portfolio";
import { isAuthenticated } from "@/lib/auth";
import { readManifestUntil, writeManifest } from "@/lib/blob-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const manifest = await readManifestUntil((m) => m.photos.some((p) => p.id === id));
  const photo = manifest.photos.find((p) => p.id === id);
  if (!photo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (body.category !== undefined) {
    if (!isUploadableCategory(body.category)) {
      return NextResponse.json({ error: "invalid category" }, { status: 400 });
    }
    photo.category = body.category;
  }
  if (body.alt !== undefined) {
    if (typeof body.alt !== "string") {
      return NextResponse.json({ error: "invalid alt" }, { status: 400 });
    }
    photo.alt = body.alt;
  }
  if (body.featured !== undefined) {
    if (typeof body.featured !== "boolean") {
      return NextResponse.json({ error: "invalid featured" }, { status: 400 });
    }
    photo.featured = body.featured;
  }

  await writeManifest(manifest);
  revalidatePath("/portfolio");
  revalidatePath("/");

  return NextResponse.json({ photo });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const manifest = await readManifestUntil((m) => m.photos.some((p) => p.id === id));
  const photo = manifest.photos.find((p) => p.id === id);
  if (!photo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await del(photo.url);
  manifest.photos = manifest.photos.filter((p) => p.id !== id);
  await writeManifest(manifest);
  revalidatePath("/portfolio");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
