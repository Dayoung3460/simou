import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SectionTitle from "@/components/section-title";
import { featuredItems } from "@/data/portfolio";

/** 대표 작업 미리보기 — 모바일 스와이프에 자연스러운 가로 필름스트립 */
export default function SelectedWorks() {
  return (
    <section className="py-6 md:py-10">
      <Reveal>
        <SectionTitle en="PORTFOLIO" ko="가장 우리다운 순간" />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden">
          {featuredItems.map((item) => (
            <li
              key={item.id}
              className="w-[68vw] shrink-0 snap-center sm:w-[44vw] md:snap-start lg:w-[30vw] xl:w-96"
            >
              <Image
                src={item.image}
                alt={item.alt}
                placeholder="blur"
                sizes="(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 68vw"
                className="aspect-[3/4] w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-8 text-center md:mt-10">
        <Link
          href="/portfolio"
          className="text-[13px] uppercase tracking-[0.2em] text-muted underline-offset-8 transition-colors hover:text-ink hover:underline"
        >
          View Portfolio
        </Link>
      </div>
    </section>
  );
}
