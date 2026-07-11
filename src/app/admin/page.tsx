import type { Metadata } from "next";
import PhotoGrid from "@/components/admin/photo-grid";
import UploadForm from "@/components/admin/upload-form";
import { PageTitle } from "@/components/section-title";
import { getPortfolioItems } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const items = await getPortfolioItems();

  return (
    <div>
      <div className="flex items-start justify-between gap-4 px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-40">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-[0.3em] text-ink md:text-4xl">
            ADMIN
          </h1>
          <p className="mt-3 text-sm text-muted">사진 관리</p>
        </div>
        <form method="POST" action="/api/admin/logout">
          <button
            type="submit"
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            로그아웃
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-5 md:px-10">
        <UploadForm />
        <PhotoGrid items={items} />
      </div>
    </div>
  );
}
