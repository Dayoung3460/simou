import { readManifest, type ManifestPhoto } from "@/lib/blob-store";

export const categories = [
  { slug: "all", label: "전체" },
  { slug: "field", label: "들판" },
  { slug: "forest", label: "숲·공원" },
  { slug: "campus", label: "캠퍼스" },
  { slug: "city", label: "시티" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type PortfolioItem = ManifestPhoto;

const uploadableSlugs: readonly Exclude<CategorySlug, "all">[] = categories
  .map((c) => c.slug)
  .filter((slug): slug is Exclude<CategorySlug, "all"> => slug !== "all");

export function isUploadableCategory(
  value: unknown,
): value is Exclude<CategorySlug, "all"> {
  return (
    typeof value === "string" &&
    (uploadableSlugs as readonly string[]).includes(value)
  );
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const manifest = await readManifest();
  return [...manifest.photos].sort((a, b) => a.order - b.order);
}

/** Work shown in the home Selected Works filmstrip */
export async function getFeaturedItems(): Promise<PortfolioItem[]> {
  const items = await getPortfolioItems();
  return items.filter((item) => item.featured);
}
