# 심오유 (SIMOU) — 야외 웨딩스냅 포트폴리오

Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript. Vercel 배포 전제.
디자인 원칙과 프로젝트 규칙은 [claude.md](./claude.md) 참고.

## 개발

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # 프로덕션 빌드
npm run screenshots   # 모바일(390px) 에뮬레이션 스크린샷 + 가로 오버플로우 검증 (서버 실행 후)
```

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 풀스크린 히어로 + 브랜드 문구 + 대표 작업 필름스트립 + 오픈 이벤트 |
| `/portfolio` | 갤러리 (전체/숲/들판/호수/바다/실내 탭, 라이트박스) |
| `/about` | 촬영 철학, 촬영 방식 |
| `/pricing` | 상품 3종(미니/A/B), 추가 옵션, 안내사항 아코디언 |
| `/contact` | 카카오톡 채널 CTA, 예약 문의 양식(복사 버튼) |

## 사진 관리

- `img/` — 원본 보관용 폴더. 사이트가 직접 사용하지 않으며 git에도 올라가지 않음 (.gitignore)
- `public/images/` — 실제 서빙되는 웹용 리사이즈본 (장변 2000px, EXIF 제거)
- 갤러리 카테고리: `field` 들판 / `forest` 숲·공원 / `campus` 캠퍼스 / `city` 시티

### 사진 교체

`public/images/...`의 기존 파일명 그대로 덮어쓰면 코드 수정 없이 반영됩니다.

### 사진 추가

1. 웹용으로 리사이즈한 jpg를 (장변 2000px 권장) `public/images/portfolio/<카테고리>/`에 넣는다
2. `src/data/portfolio.ts`에 import 한 줄 + `portfolioItems` 항목을 추가한다 (static import라 width/height/blur 자동 처리)
3. `alt` 텍스트에 사진 내용을 짧게 적는다 (SEO·접근성)
4. 홈 필름스트립에 노출할 사진은 같은 파일의 `featuredIds`에서 고른다

### 주요 이미지 위치

| 용도 | 파일 | 원본 |
| --- | --- | --- |
| 홈 히어로 | `public/images/hero/hero-01.jpg` | `img/field-02.jpg` |
| About 상단/하단 | `public/images/about/about-01.jpg`, `about-02.jpg` | `img/forest-02.jpeg`, `img/field-01.jpg` |
| 로고 | `public/images/logo.png` (투명 PNG) | `img/logo.jpeg`에서 배경 제거 |
| OG 공유 이미지 | `public/og.png` (1200×630) | `img/rep.png` 기반 |

## 오픈 전 체크리스트

- [ ] `src/data/site.ts`의 `CHANGE_ME` 링크 교체 (카카오톡 채널, 인스타그램)
- [ ] `src/data/site.ts`의 `url`을 실제 도메인으로 변경 (sitemap/OG 절대경로에 사용됨)
- [ ] 상품·가격 변동 시 `src/data/products.ts` 수정
