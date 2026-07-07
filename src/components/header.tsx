"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/mobile-menu";
import { site } from "@/data/site";
import logo from "../../public/images/logo.png";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sits transparently over the home hero, gains a background once scrolled
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-line bg-cream/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-10">
        <Link href="/" aria-label="심오유 홈으로 이동" className="block">
          <Image
            src={logo}
            alt="SIMOU 심오유"
            priority
            className="h-4 w-auto md:h-5"
          />
        </Link>

        <nav aria-label="주 메뉴" className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] uppercase tracking-[0.18em] transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
