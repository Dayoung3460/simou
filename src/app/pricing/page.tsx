import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/pricing/product-card";
import Reveal from "@/components/reveal";
import { PageTitle } from "@/components/section-title";
import {
  extraOptions,
  noticeAgreement,
  notices,
  openEvent,
  productNotes,
  products,
  travelFee,
} from "@/data/products";

export const metadata: Metadata = {
  title: "상품 안내",
  description:
    "심오유 야외 웨딩스냅 상품 구성과 가격 안내 — 미니, A, B 타입. 2026 하반기 오픈 이벤트 진행 중.",
};

export default function PricingPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageTitle en="PRICING" ko="상품 안내" />

      <div className="mx-auto max-w-4xl px-5 md:px-10">
        {/* Open Event */}
        <Reveal className="mx-auto max-w-lg border-y border-line py-10 text-center md:py-12">
          <p className="font-serif text-2xl font-light italic text-ink">
            {openEvent.title}
          </p>
          {openEvent.lines.map((line, i) => (
            <p
              key={line}
              className={`text-sm leading-7 text-body ${i === 0 ? "mt-5" : "mt-1"}`}
            >
              {line}
            </p>
          ))}
          <p className="mt-4 text-[13px] text-muted">{openEvent.bonus}</p>
        </Reveal>

        {/* Shared product notes */}
        <div className="mx-auto mt-10 max-w-lg space-y-2 text-center">
          {productNotes.map((note) => (
            <p key={note} className="text-[13px] leading-6 text-muted">
              {note}
            </p>
          ))}
        </div>

        {/* Three product types */}
        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Extra options */}
        <section className="mt-20 border-t border-line pt-10 md:mt-24">
          <h2 className="text-center font-serif text-xl font-light tracking-[0.25em] text-ink">
            OPTION
          </h2>
          <p className="mt-3 text-center text-sm text-muted">추가 옵션 상품</p>
          <ul className="mt-6 space-y-2 text-center text-sm leading-7 text-body">
            {extraOptions.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <p className="mt-5 text-center text-[13px] text-muted">{travelFee}</p>
        </section>

        {/* Notices */}
        <section className="mx-auto mt-20 max-w-2xl md:mt-24">
          <h2 className="text-center font-serif text-xl font-light tracking-[0.25em] text-ink">
            NOTICE
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            촬영 관련 필독 사항 안내
          </p>
          <div className="mt-8 border-t border-line">
            {notices.map((group) => (
              <details key={group.title} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm text-ink [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <span
                    aria-hidden
                    className="text-lg font-light text-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="space-y-3 pb-6 text-[13px] leading-6 text-body">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="text-muted">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-muted">{noticeAgreement}</p>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center md:mt-20">
          <Link
            href="/contact"
            className="inline-block border border-ink px-10 py-4 text-[13px] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            문의 및 예약
          </Link>
        </div>
      </div>
    </div>
  );
}
