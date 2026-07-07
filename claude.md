@AGENTS.md

# SIMOU (심오유) — Project Guide

Portfolio site for SIMOU, a Korean outdoor wedding-snap studio. Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript.
Source content lives in `blog.md`. Don't invent product/pricing/notice copy — always defer to `blog.md`.

## Design Principles

Photos are the star. Keep the UI minimal so it never competes with the photos, and leave generous whitespace.

### Color (globals.css `@theme` tokens — do not add arbitrary colors)

- `cream` `#FDFCFA` — background (a very faint warm tint instead of pure white)
- `ink` `#1A1A1A` — headings, logo, emphasis
- `body` `#4A4A4A` — body text
- `muted` `#8A8580` — secondary text, inactive states (warm gray)
- `line` `#E8E5E0` — dividers, borders
- No accent color. Buttons come in exactly two forms: ink outline or ink fill.

### Typography

- Logo: use the real image asset `public/images/logo.png` (transparent, ink-colored wordmark; static import in header/menu/footer at `h-4 w-auto`~`h-5`). Don't render the logo as text. Source: `img/logo.jpeg`
- English display text (section titles): Cormorant Garamond (`font-serif`), font-light, tracking `0.2~0.4em`, uppercase
- Korean/body text: Pretendard (`font-sans`, jsdelivr dynamic subset CDN). Default body letter-spacing `-0.01em`
- Section title pattern: English serif caps + Korean subtitle (`text-sm text-muted`) — use the `SectionTitle` component
- Body line-height should be generous (leading-7~9)
- Korean line breaks must happen at word boundaries — `word-break: keep-all` is applied to body in globals.css. Don't use `break-all` arbitrarily in new components

### Spacing & Layout

- Mobile-first: base styles target mobile (375~390px), expand at `md:` and above
- Section vertical padding `py-24` or more (`md:py-32~36`). Err on the side of too much whitespace rather than too little
- Content width: text `max-w-xl~2xl`, overall container `max-w-6xl px-5 md:px-10`
- No shadows, rounded corners, or heavy borders. Use `border-line` hairlines only for separation
- Animation limited to `Reveal`-level (scroll fade-up) subtlety. No flashy motion

### Component Rules

- Images must use next/image + static import (automatic blur placeholder & dimensions)
- Only the home hero gets `priority`; everything else defaults to lazy
- Text CTA: `underline-offset-8` + hover underline / Button CTA: `border border-ink` outline
- Header is fixed: transparent over the home hero → `cream/90 + backdrop-blur` on scroll
- Hero uses `h-svh` (to handle the iOS address bar)

## Where to Edit Data

- Products/pricing/notices: `src/data/products.ts`
- Gallery photos: `src/data/portfolio.ts` (see README for replacement instructions). Categories reflect the real photos (as of 2026-07-07): 들판 `field` / 숲·공원 `forest` / 캠퍼스 `campus` / 시티 `city`
- Photo originals live in `img/` (kept out of git, not served); web-sized copies (long edge 2000px, EXIF stripped) live in `public/images/`. `scripts/generate-placeholders.mjs` is retired — running it would overwrite the real hero/about/og images
- Site name/links/philosophy copy: `src/data/site.ts` — Kakao/Instagram links have `CHANGE_ME` placeholders
- When the open event (limited to 2nd half of 2026) ends, don't just delete `openEvent` from `products.ts` — the home page (`src/app/page.tsx`) and the Pricing page's Open Event section both import it, so clean up both together

## Verification Notes (pitfalls confirmed this session)

- Basic verification: `npm run build` → `npx next start -p 3007` → curl all routes and confirm 200
- Mobile visual verification: after starting the server, run `npm run screenshots -- <server-url>` — this script (`scripts/screenshot-mobile.mjs`) already handles the pitfalls below. It emulates 390px, captures every page + menu/lightbox states into `.screenshots/`, and auto-flags horizontal overflow
- It's expected/normal for `/portfolio` to show up as SSR (ƒ) in the build — the category filter is a server-side filter based on `searchParams`
- **Do not verify mobile layout with headless desktop Chrome at `--window-size=390`.** Desktop Chrome has a minimum window width of ~500px, so even with 390 specified it renders at 500, creating an optical illusion where centered content appears shifted ~55px to the right (easily mistaken for horizontal overflow). Always emulate with CDP `Emulation.setDeviceMetricsOverride({ width: 390, mobile: true })` instead
- **In full-page captures (`captureBeyondViewport: true`), `Reveal` (IntersectionObserver) sections render as opacity-0.** This is just a capture artifact — no scroll events fire, so the fade-in never triggers — not an actual bug. Auto-scroll to the bottom of the page before capturing to avoid this