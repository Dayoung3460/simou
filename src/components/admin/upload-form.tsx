"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { categories } from "@/data/portfolio";

const uploadableCategories = categories.filter((c) => c.slug !== "all");

export default function UploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/photos", { method: "POST", body: formData });

    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "업로드에 실패했습니다.");
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 border border-line p-5"
    >
      <label className="flex flex-col gap-2 text-sm text-muted">
        카테고리
        <select
          name="category"
          required
          className="border border-line bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        >
          {uploadableCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-muted">
        사진 (여러 장 선택 가능)
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          required
          className="text-sm text-ink"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="border border-ink px-6 py-2.5 text-[13px] tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
      >
        {pending ? "업로드 중…" : "업로드"}
      </button>

      {error && <p className="w-full text-sm text-body">{error}</p>}
    </form>
  );
}
