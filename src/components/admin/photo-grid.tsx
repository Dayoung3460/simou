"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, type CategorySlug, type PortfolioItem } from "@/data/portfolio";

const editableCategories = categories.filter((c) => c.slug !== "all");

export default function PhotoGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <PhotoCard key={item.id} item={item} />
      ))}
    </ul>
  );
}

function PhotoCard({ item }: { item: PortfolioItem }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setPending(true);
    setError(false);
    const res = await fetch(`/api/admin/photos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) setError(true);
    router.refresh();
    setPending(false);
  }

  async function handleDelete() {
    if (!confirm("이 사진을 삭제할까요?")) return;
    setPending(true);
    setError(false);
    const res = await fetch(`/api/admin/photos/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(true);
      setPending(false);
      return;
    }
    router.refresh();
  }

  return (
    <li className="border border-line">
      <Image
        src={item.url}
        alt={item.alt}
        width={item.width}
        height={item.height}
        placeholder="blur"
        blurDataURL={item.blurDataURL}
        sizes="(min-width: 1024px) 25vw, 46vw"
        className="aspect-[3/4] w-full object-cover"
      />

      <div className="flex flex-col gap-2 p-3">
        <select
          defaultValue={item.category}
          disabled={pending}
          onChange={(e) => patch({ category: e.target.value as CategorySlug })}
          className="border border-line bg-transparent px-2 py-1.5 text-sm text-ink outline-none focus:border-ink"
        >
          {editableCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          defaultValue={item.alt}
          disabled={pending}
          onBlur={(e) => {
            if (e.target.value !== item.alt) patch({ alt: e.target.value });
          }}
          placeholder="대체 텍스트"
          className="border border-line bg-transparent px-2 py-1.5 text-sm text-ink outline-none focus:border-ink"
        />

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            defaultChecked={item.featured}
            disabled={pending}
            onChange={(e) => patch({ featured: e.target.checked })}
          />
          홈 화면에 노출
        </label>

        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="mt-1 text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50"
        >
          삭제
        </button>

        {error && (
          <p className="text-xs text-red-600">
            처리에 실패했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
      </div>
    </li>
  );
}
