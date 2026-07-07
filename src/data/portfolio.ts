import type { StaticImageData } from "next/image";

/**
 * 포트폴리오 갤러리 데이터. (원본 사진은 img/, 웹용 리사이즈본은 public/images/)
 *
 * 사진 추가/교체 방법:
 * 1. public/images/portfolio/<카테고리>/ 에 jpg 파일을 넣는다
 *    (기존 파일명 그대로 덮어쓰면 코드 수정 없이 교체됨)
 * 2. 새 파일이면 아래에 import 한 줄과 portfolioItems 항목을 추가한다
 *    (static import라서 width/height/blur가 자동 처리됨)
 */
import field01 from "../../public/images/portfolio/field/field-01.jpg";
import field02 from "../../public/images/portfolio/field/field-02.jpg";
import field03 from "../../public/images/portfolio/field/field-03.jpg";
import field04 from "../../public/images/portfolio/field/field-04.jpg";
import field05 from "../../public/images/portfolio/field/field-05.jpg";
import forest01 from "../../public/images/portfolio/forest/forest-01.jpg";
import forest02 from "../../public/images/portfolio/forest/forest-02.jpg";
import forest03 from "../../public/images/portfolio/forest/forest-03.jpg";
import forest04 from "../../public/images/portfolio/forest/forest-04.jpg";
import campus01 from "../../public/images/portfolio/campus/campus-01.jpg";
import campus02 from "../../public/images/portfolio/campus/campus-02.jpg";
import campus03 from "../../public/images/portfolio/campus/campus-03.jpg";
import campus04 from "../../public/images/portfolio/campus/campus-04.jpg";
import city01 from "../../public/images/portfolio/city/city-01.jpg";
import city02 from "../../public/images/portfolio/city/city-02.jpg";

export const categories = [
  { slug: "all", label: "전체" },
  { slug: "field", label: "들판" },
  { slug: "forest", label: "숲·공원" },
  { slug: "campus", label: "캠퍼스" },
  { slug: "city", label: "시티" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type PortfolioItem = {
  id: string;
  image: StaticImageData;
  alt: string;
  category: Exclude<CategorySlug, "all">;
};

/** '전체' 탭이 단조롭지 않도록 카테고리를 섞어서 배열 */
export const portfolioItems: PortfolioItem[] = [
  { id: "field-05", image: field05, alt: "들판에서 서로에게 기대어 입맞추는 신랑과 신부, 흑백", category: "field" },
  { id: "campus-01", image: campus01, alt: "붉은 벽돌 건물 앞에서 레드 부케를 든 신랑과 신부", category: "campus" },
  { id: "forest-01", image: forest01, alt: "들꽃 핀 정원 길을 걷는 신랑과 신부", category: "forest" },
  { id: "city-01", image: city01, alt: "빗속 자동차 앞에서의 흑백 시티 스냅", category: "city" },
  { id: "field-01", image: field01, alt: "물가 수풀에 앉아 부케를 든 신부", category: "field" },
  { id: "campus-03", image: campus03, alt: "빨간 공중전화 부스 앞의 신랑과 신부", category: "campus" },
  { id: "forest-02", image: forest02, alt: "소나무 아래에서 베일이 바람에 날리는 신부", category: "forest" },
  { id: "city-02", image: city02, alt: "도시의 밤, 도로 위에서 입맞추는 흑백 스냅", category: "city" },
  { id: "field-02", image: field02, alt: "초원에서 손을 잡고 걷는 신랑과 신부", category: "field" },
  { id: "campus-02", image: campus02, alt: "벽돌 캠퍼스를 배경으로 나란히 선 신랑과 신부", category: "campus" },
  { id: "forest-03", image: forest03, alt: "공원에서 부케를 든 신부와 신랑의 투컷", category: "forest" },
  { id: "field-03", image: field03, alt: "들꽃 부케를 들고 서로 기댄 블랙 드레스의 신부와 신랑", category: "field" },
  { id: "campus-04", image: campus04, alt: "벽돌 건물 입구에서 마주 보는 신랑과 신부", category: "campus" },
  { id: "forest-04", image: forest04, alt: "잔디밭에서 그린 톤 부케를 든 신랑", category: "forest" },
  { id: "field-04", image: field04, alt: "수풀 들판에 나란히 선 신랑과 신부", category: "field" },
];

/** 홈 Selected Works 필름스트립에 노출할 작업 */
const featuredIds = [
  "field-05",
  "campus-01",
  "forest-02",
  "city-02",
  "field-01",
  "campus-03",
  "forest-01",
  "city-01",
];

export const featuredItems: PortfolioItem[] = featuredIds.flatMap((id) =>
  portfolioItems.filter((item) => item.id === id),
);
