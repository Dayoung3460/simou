import { get, put } from "@vercel/blob";
import type { CategorySlug } from "@/data/portfolio";

export type ManifestPhoto = {
  id: string;
  url: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
  category: Exclude<CategorySlug, "all">;
  featured: boolean;
  order: number;
};

export type Manifest = {
  version: 1;
  photos: ManifestPhoto[];
};

const MANIFEST_PATHNAME = "portfolio/manifest.json";

// The manifest lives in its own dedicated *private* Blob store — separate from the store that
// holds the actual photo files (which stays public, since photos are served directly to browsers
// via next/image). Reasons for splitting it out: the manifest is never fetched by a browser, only
// read server-side, so there's no reason to expose it on the public CDN. Reading it privately (via
// an authenticated `get()` call rather than a plain `fetch()` to a public URL) also sidesteps two
// issues observed when it was public: Vercel's Security Checkpoint (anti-bot protection)
// occasionally challenging the anonymous public fetch instead of serving the blob, and public CDN
// edge-cache staleness after a write (`useCache: false` only takes effect for private blobs,
// forcing a read straight from origin storage — this eliminates prior read-after-write lag too).
const MANIFEST_BLOB_TOKEN = process.env.MANIFEST_BLOB_READ_WRITE_TOKEN;

const emptyManifest: Manifest = { version: 1, photos: [] };

/** Throws on any read failure — never silently treat "read failed" as "genuinely empty" */
async function readManifestStrict(): Promise<Manifest> {
  const result = await get(MANIFEST_PATHNAME, {
    access: "private",
    useCache: false,
    token: MANIFEST_BLOB_TOKEN,
  });
  if (!result) return emptyManifest;
  return (await new Response(result.stream).json()) as Manifest;
}

/**
 * Falls back to an empty manifest on any Blob error so a storage hiccup never crashes a render or
 * the build. Safe for read-only pages (a transient failure just shows an empty gallery), but must
 * NOT be used before a write — see `readManifestForMutation`.
 */
export async function readManifest(): Promise<Manifest> {
  try {
    return await readManifestStrict();
  } catch {
    return emptyManifest;
  }
}

/**
 * For use immediately before a read-modify-write (upload/edit/delete). Unlike `readManifest`, this
 * propagates read failures instead of swallowing them — a transient Blob hiccup here must never be
 * mistaken for "there are genuinely zero photos," or the follow-up write would silently wipe out
 * every existing photo's metadata. (This is exactly what happened once during development: a
 * transient read failure during an upload was swallowed, and the write overwrote the manifest with
 * only the new photo, discarding the rest.)
 */
export async function readManifestForMutation(): Promise<Manifest> {
  return readManifestStrict();
}

/**
 * Same as `readManifestForMutation`, but retries a few times if `predicate` doesn't match any photo
 * yet. Now that reads go straight to origin storage (see `readManifestStrict`), this is mostly a
 * defensive safety net rather than a fix for a known lag — kept in case any eventual-consistency
 * window remains, e.g. an admin action (PATCH/DELETE) targeting a photo uploaded moments earlier.
 */
export async function readManifestUntil(
  predicate: (manifest: Manifest) => boolean,
  { attempts = 5, delayMs = 500 }: { attempts?: number; delayMs?: number } = {},
): Promise<Manifest> {
  let lastManifest: Manifest | undefined;
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
    try {
      lastManifest = await readManifestForMutation();
      lastError = undefined;
      if (predicate(lastManifest)) return lastManifest;
    } catch (err) {
      lastError = err;
    }
  }
  if (lastError) throw lastError;
  // Ran out of attempts but reads kept succeeding without the predicate ever matching — return as-is.
  return lastManifest!;
}

export async function writeManifest(manifest: Manifest): Promise<void> {
  await put(MANIFEST_PATHNAME, JSON.stringify(manifest), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: MANIFEST_BLOB_TOKEN,
  });
}
