import type { Metadata } from "next";
import Link from "next/link";
import LightboxGallery from "@/components/portfolio/lightbox-gallery";
import { PageTitle } from "@/components/section-title";
import {
  categories,
  portfolioItems,
  type CategorySlug,
} from "@/data/portfolio";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "심오유의 야외 웨딩스냅 포트폴리오 — 숲, 들판, 호수, 바다, 실내.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active: CategorySlug = categories.some((c) => c.slug === category)
    ? (category as CategorySlug)
    : "all";
  const items =
    active === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === active);

  return (
    <div className="pb-24 md:pb-32">
      <PageTitle en="PORTFOLIO" ko="포트폴리오" />

      <nav
        aria-label="포트폴리오 카테고리"
        className="flex flex-wrap justify-center gap-x-6 gap-y-3 px-5 md:gap-x-9"
      >
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={c.slug === "all" ? "/portfolio" : `/portfolio?category=${c.slug}`}
            className={`pb-1.5 text-sm transition-colors ${
              active === c.slug
                ? "border-b border-ink text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="mx-auto mt-10 max-w-6xl px-5 md:mt-14 md:px-10">
        <LightboxGallery items={items} />
      </div>
    </div>
  );
}
