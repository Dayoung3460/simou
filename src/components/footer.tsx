import Image from "next/image";
import { site } from "@/data/site";
import logo from "../../public/images/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-14 text-center md:py-16">
        <Image src={logo} alt="SIMOU 심오유" className="h-4 w-auto" />
        <p className="text-sm text-muted">{site.tagline}</p>
        <div className="flex items-center gap-6 text-[13px] text-muted">
          <a
            href={site.links.kakao}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            카카오톡 채널
          </a>
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
            Blog
          </a>
        </div>
        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} {site.name} SIMOU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
