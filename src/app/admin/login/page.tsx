import type { Metadata } from "next";
import { PageTitle } from "@/components/section-title";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <PageTitle en="ADMIN" ko="관리자 로그인" />
      <form
        method="POST"
        action="/api/admin/login"
        className="mx-auto flex max-w-xs flex-col gap-5 px-5"
      >
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          autoFocus
          className="border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
        {error && <p className="text-sm text-body">비밀번호가 올바르지 않습니다.</p>}
        <button
          type="submit"
          className="border border-ink px-6 py-3 text-[13px] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
