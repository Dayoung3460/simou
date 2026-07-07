"use client";

import Image, { type StaticImageData } from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
  type RenderSlideProps,
  type Slide,
  type SlideImage,
} from "yet-another-react-lightbox";

/**
 * yet-another-react-lightbox 공식 Next.js 예제 기반 —
 * 라이트박스 슬라이드도 next/image 최적화 파이프라인을 태운다.
 */
function isNextJsImage(slide: Slide): slide is SlideImage & StaticImageData {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  );
}

export default function NextJsImage({ slide, offset, rect }: RenderSlideProps) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();
  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return undefined;

  const width = !cover
    ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width))
    : rect.width;
  const height = !cover
    ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height))
    : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={slide.alt ?? ""}
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}
