"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import NextJsImage from "@/components/portfolio/nextjs-image";
import type { PortfolioItem } from "@/data/portfolio";

/** Masonry grid + click-to-open lightbox (swipe/keyboard support) */
export default function LightboxGallery({ items }: { items: PortfolioItem[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <ul className="columns-2 gap-3 lg:columns-3 lg:gap-5">
        {items.map((item, i) => (
          <li key={item.id} className="mb-3 break-inside-avoid lg:mb-5">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${item.alt} 크게 보기`}
              className="group block w-full cursor-zoom-in"
            >
              <Image
                src={item.url}
                alt={item.alt}
                width={item.width}
                height={item.height}
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                sizes="(min-width: 1024px) 31vw, 46vw"
                className="w-full transition-opacity duration-300 group-hover:opacity-90"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={items.map((item) => ({
          src: item.url,
          width: item.width,
          height: item.height,
          blurDataURL: item.blurDataURL,
          alt: item.alt,
        }))}
        render={{ slide: NextJsImage }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(20, 19, 17, 0.96)" } }}
      />
    </>
  );
}
