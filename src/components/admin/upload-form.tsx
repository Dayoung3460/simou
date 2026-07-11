"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { categories } from "@/data/portfolio";

const uploadableCategories = categories.filter((c) => c.slug !== "all");

// The server re-encodes to a 2000px-long-edge JPEG anyway, so downscaling in the browser first
// loses nothing while keeping each request well under the body limits (10MB dev proxy buffer,
// 4.5MB Vercel function body).
const MAX_EDGE = 2400;
const REENCODE_THRESHOLD_BYTES = 3 * 1024 * 1024;

async function shrinkForUpload(file: File): Promise<Blob> {
  if (file.size <= REENCODE_THRESHOLD_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
    return blob ?? file;
  } catch {
    // Formats the browser can't decode (e.g. HEIC outside Safari) fall through as-is
    return file;
  }
}

export default function UploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const category = formData.get("category");
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (typeof category !== "string" || files.length === 0) return;

    setError(null);
    setProgress({ done: 0, total: files.length });

    // One file per request keeps each body small and lets partial batches survive a failure
    let uploaded = 0;
    for (const file of files) {
      const body = new FormData();
      body.set("category", category);
      body.set("files", await shrinkForUpload(file), file.name);

      let res: Response | null = null;
      try {
        res = await fetch("/api/admin/photos", { method: "POST", body });
      } catch {
        // network failure — reported below
      }
      if (!res || !res.ok) {
        const detail = res ? await res.json().then((b) => b.error).catch(() => null) : null;
        setError(
          `"${file.name}" 업로드에 실패했습니다 (${uploaded}/${files.length}장 완료).` +
            (detail ? ` — ${detail}` : "")
        );
        break;
      }
      uploaded += 1;
      setProgress({ done: uploaded, total: files.length });
    }

    setProgress(null);
    if (uploaded === files.length) formRef.current?.reset();
    if (uploaded > 0) router.refresh();
  }

  const pending = progress !== null;

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
        {pending ? `업로드 중… (${progress.done}/${progress.total})` : "업로드"}
      </button>

      {error && <p className="w-full text-sm text-body">{error}</p>}

      <ul className="w-full space-y-1 text-xs leading-5 text-muted">
        <li>큰 사진은 업로드 전에 자동으로 축소되고, 여러 장을 선택하면 한 장씩 차례로 올라갑니다.</li>
        <li>JPG·PNG·WebP 파일을 권장합니다. HEIC 등 일부 형식은 원본 그대로 전송되어 4MB가 넘으면 실패할 수 있으니, 실패하면 JPG로 변환 후 다시 올려 주세요.</li>
        <li>장수 제한은 없지만, 중간에 끊겨도 확인하기 쉽도록 한 번에 20장 이하로 나눠 올리는 것을 권장합니다.</li>
      </ul>
    </form>
  );
}
