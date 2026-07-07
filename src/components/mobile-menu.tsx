"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import logo from "../../public/images/logo.png";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="-mr-2 flex h-11 w-11 items-center justify-center"
      >
        <span className="relative block h-2.5 w-6">
          <span className="absolute left-0 top-0 h-px w-full bg-ink" />
          <span className="absolute bottom-0 left-0 h-px w-full bg-ink" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
          className="fixed inset-0 z-50 flex flex-col bg-cream px-5"
        >
          <div className="flex h-16 items-center justify-between">
            <Image src={logo} alt="SIMOU 심오유" className="h-4 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="메뉴 닫기"
              className="-mr-2 flex h-11 w-11 items-center justify-center"
            >
              <span className="relative block h-6 w-6">
                <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-ink" />
                <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-ink" />
              </span>
            </button>
          </div>

          <nav aria-label="모바일 메뉴" className="mt-14 flex flex-col gap-7">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4"
              >
                <span className="font-serif text-3xl font-light tracking-[0.2em] text-ink">
                  {item.label}
                </span>
                <span className="text-sm text-muted">{item.ko}</span>
              </Link>
            ))}
          </nav>

          <div className="mb-10 mt-auto flex gap-6 text-sm text-muted">
            <a href={site.links.kakao} target="_blank" rel="noreferrer">
              카카오톡 채널
            </a>
            <a href={site.links.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={site.links.blog} target="_blank" rel="noreferrer">
              Blog
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
