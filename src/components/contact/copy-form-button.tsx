"use client";

import { useState } from "react";

/** Copies the booking form to the clipboard — handy for pasting into KakaoTalk */
export default function CopyFormButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fail silently where the Clipboard API isn't supported
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
