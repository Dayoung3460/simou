import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/home/hero";
import SelectedWorks from "@/components/home/selected-works";
import Reveal from "@/components/reveal";
import SectionTitle from "@/components/section-title";
import { openEvent } from "@/data/products";
import { site } from "@/data/site";
import brandMark from "../../public/images/brand-mark.jpg";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 브랜드 스테이트먼트 */}
      <section className="px-5 py-24 md:py-36">
        <Reveal className="mx-auto max-w-xl text-center">
          <Image
            src={brandMark}
            alt="카라 릴리 위에 얹힌 SIMOU 브랜드 마크"
            placeholder="blur"
            sizes="(min-width: 768px) 128px, 104px"
            className="mx-auto h-26 w-26 md:h-32 md:w-32"
          />
          <div className="mt-8 space-y-5 text-[15px] leading-8 text-body md:text-base md:leading-9">
            <p>{site.philosophy[0]}</p>
            <p>{site.philosophy[1]}</p>
          </div>
        </Reveal>
      </section>

      <SelectedWorks />

      {/* Open Event */}
      <section className="px-5 py-24 md:py-32">
        <Reveal className="mx-auto max-w-md border-y border-line py-10 text-center md:max-w-lg md:py-12">
          <p className="font-serif text-2xl font-light italic text-ink">
            {openEvent.title}
          </p>
          <p className="mt-5 text-sm leading-7 text-body">{openEvent.lines[0]}</p>
          <p className="mt-2 text-[13px] text-muted">{openEvent.bonus}</p>
          <Link
            href="/pricing"
            className="mt-7 inline-block text-[13px] tracking-[0.15em] text-muted underline-offset-8 transition-colors hover:text-ink hover:underline"
          >
            상품 안내 보기
          </Link>
        </Reveal>
      </section>

      {/* Contact CTA */}
      <section className="px-5 pb-28 md:pb-36">
        <Reveal className="text-center">
          <SectionTitle en="CONTACT" ko="문의 및 예약" />
          <Link
            href="/contact"
            className="mt-9 inline-block border border-ink px-10 py-4 text-[13px] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            문의 및 예약 안내
          </Link>
        </Reveal>
      </section>
    </>
  );
}
