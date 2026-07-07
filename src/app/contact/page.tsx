import type { Metadata } from "next";
import CopyFormButton from "@/components/contact/copy-form-button";
import Reveal from "@/components/reveal";
import { PageTitle } from "@/components/section-title";
import { contactGuide, reservationForm } from "@/data/products";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "문의 및 예약",
  description:
    "심오유 야외 웨딩스냅 촬영 문의 및 예약 안내 — 카카오톡 채널로 편하게 문의 주세요.",
};

export default function ContactPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageTitle en="CONTACT" ko="문의 및 예약" />

      <div className="mx-auto max-w-md px-5">
        <Reveal className="text-center">
          <div className="space-y-2 text-sm leading-7 text-body">
            {contactGuide.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <a
            href={site.links.kakao}
            target="_blank"
            rel="noreferrer"
            className="mt-10 block w-full bg-ink py-4 text-center text-[13px] tracking-[0.2em] text-cream transition-opacity hover:opacity-85"
          >
            카카오톡 채널로 문의하기
          </a>
        </Reveal>

        {/* 예약 문의 양식 */}
        <Reveal className="mt-14 border border-line p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm tracking-[0.15em] text-ink">예약 문의 양식</h2>
            <CopyFormButton text={reservationForm.join("\n")} />
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-body">
            {reservationForm.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14 flex justify-center gap-8 text-sm text-muted">
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
          <a
            href={site.links.blog}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            Naver Blog
          </a>
        </Reveal>
      </div>
    </div>
  );
}
