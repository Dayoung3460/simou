import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { PageTitle } from "@/components/section-title";
import { site } from "@/data/site";
import about01 from "../../../public/images/about/about-01.jpg";
import about02 from "../../../public/images/about/about-02.jpg";

export const metadata: Metadata = {
  title: "소개",
  description:
    "공장식 촬영을 지양하고 두 분만의 자연스러운 순간을 담는 야외 웨딩스냅, 심오유의 촬영 철학을 소개합니다.",
};

/** Three shooting-approach steps distilled from blog.md's notice copy */
const approach = [
  {
    no: "01",
    title: "사전 미팅",
    text: "두 분만의 이야기를 담기 위해 사전미팅을 진행합니다. 두 분의 일정에 맞춰 유선으로 진행되며, 미팅이 어려우신 경우 설문지 작성으로 대체됩니다.",
  },
  {
    no: "02",
    title: "장소 제안",
    text: "촬영 장소는 들판, 숲, 바다 등 상담 후 작가 추천으로 안내드립니다. 두 분만의 의미 있는 장소가 있다면 적극 반영합니다.",
  },
  {
    no: "03",
    title: "자연스러운 보정",
    text: "과도한 보정보다 자연스러운 보정을 지향합니다. 기본적인 색감 보정, 피부 보정, 전체적인 라인 정리 등의 보정이 진행됩니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageTitle en="ABOUT" ko="심오유" />

      <div className="mx-auto max-w-2xl px-5">
        {/* Brand philosophy */}
        <Reveal className="text-center">
          <div className="space-y-5 text-base leading-9 text-ink md:text-lg md:leading-10">
            <p>{site.philosophy[0]}</p>
            <p>{site.philosophy[1]}</p>
          </div>
        </Reveal>

        <Reveal className="mt-16 md:mt-20">
          <Image
            src={about01}
            alt="소나무 아래에서 베일이 바람에 날리는 신부"
            placeholder="blur"
            sizes="(min-width: 768px) 28rem, 100vw"
            className="mx-auto w-full max-w-md"
          />
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-xl text-center md:mt-20">
          <div className="space-y-6 text-[15px] leading-8 text-body">
            <p>{site.philosophy[2]}</p>
            <p>{site.philosophy[3]}</p>
          </div>
        </Reveal>

        <Reveal className="mt-16 border-y border-line py-10 text-center md:mt-20">
          <p className="text-base leading-8 text-ink md:text-lg">
            {site.philosophy[4]}
          </p>
        </Reveal>

        {/* How we work */}
        <section className="mt-20 md:mt-24">
          <h2 className="text-center font-serif text-xl font-light tracking-[0.25em] text-ink">
            HOW WE WORK
          </h2>
          <p className="mt-3 text-center text-sm text-muted">촬영 방식</p>
          <div className="mt-10 space-y-10 md:mt-12">
            {approach.map((step) => (
              <Reveal key={step.no} className="flex gap-6">
                <span className="font-serif text-2xl font-light text-muted">
                  {step.no}
                </span>
                <div>
                  <h3 className="text-sm tracking-[0.1em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-7 text-body">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-20 md:mt-24">
          <Image
            src={about02}
            alt="물가 수풀에 앉아 부케를 든 신부"
            placeholder="blur"
            sizes="(min-width: 768px) 42rem, 100vw"
            className="w-full"
          />
        </Reveal>

        <div className="mt-14 text-center md:mt-16">
          <Link
            href="/portfolio"
            className="text-[13px] uppercase tracking-[0.2em] text-muted underline-offset-8 transition-colors hover:text-ink hover:underline"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
