import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SectionTitle from "@/components/section-title";
import type { PortfolioItem } from "@/data/portfolio";

/** Featured-work preview — a horizontal filmstrip that swipes naturally on mobile */
export default function SelectedWorks({ items }: { items: PortfolioItem[] }) {
  return (
    <section className="py-6 md:py-10">
      <Reveal>
        <SectionTitle en="PORTFOLIO" ko="가장 우리다운 순간" />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li
              key={item.id}
              className="w-[68vw] shrink-0 snap-center sm:w-[44vw] md:snap-start lg:w-[30vw] xl:w-96"
            >
              <Image
                src={item.url}
                alt={item.alt}
                width={item.width}
                height={item.height}
                placeholder="blur"
                blurDataURL={item.blurDataURL}
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
