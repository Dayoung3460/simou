"use client";

import { useState } from "react";

/** 예약 양식을 클립보드에 복사 — 카카오톡에 붙여넣기 좋게 */
export default function CopyFormButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 미지원 환경에서는 조용히 무시
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs tracking-wide text-muted underline underline-offset-4 transition-colors hover:text-ink"
    >
      {copied ? "복사되었습니다" : "양식 복사하기"}
    </button>
  );
}
