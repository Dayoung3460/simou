import Image from "next/image";
import { site } from "@/data/site";
import hero from "../../../public/images/hero/hero-01.jpg";

export default function Hero() {
  return (
    <section className="relative h-svh w-full">
      <Image
        src={hero}
        alt="초원에서 손을 잡고 걷는 신랑과 신부 — 심오유 대표 사진"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
      />

      {/* 사진 위 텍스트 가독성용 그라데이션 — 실제 사진 밝기에 따라 강도 조절 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream/35 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink/30 to-transparent"
      />

      <h1 className="sr-only">심오유 — 자연스러운 야외 웨딩스냅</h1>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-7 pb-12 text-center md:pb-16">
        <p className="px-5 text-[15px] font-light tracking-wide text-white/95 md:text-lg">
          {site.tagline}
        </p>
        <span aria-hidden className="block h-10 w-px bg-white/50 md:h-14" />
      </div>
    </section>
  );
}
