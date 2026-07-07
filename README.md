# SIMOU (심오유) — Outdoor Wedding-Snap Portfolio

Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript. Built for Vercel deployment.
See [claude.md](./claude.md) for design principles and project conventions.

## Development

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # production build
npm run screenshots   # mobile (390px) emulated screenshots + horizontal-overflow check (run against a live server)
```

## Pages

| Route | Content |
| --- | --- |
| `/` | Full-screen hero + brand copy + featured-work filmstrip + open event |
| `/portfolio` | Gallery (All/Field/Forest·Park/Campus/City tabs, lightbox) |
| `/about` | Shooting philosophy, shooting style |
| `/pricing` | 3 packages (Mini/A/B), add-ons, notices accordion |
| `/contact` | KakaoTalk channel CTA, booking inquiry form (copy button) |

## Photo Management

- `img/` — folder for originals. Not used directly by the site and not committed to git (`.gitignore`)
- `public/images/` — resized web copies actually served (long edge 2000px, EXIF stripped)
- Gallery categories: `field` / `forest` (forest & park) / `campus` / `city`

### Replacing a Photo

Overwrite the existing file under `public/images/...` with the same filename — no code changes needed.

### Adding a Photo

1. Drop a web-resized jpg (long edge 2000px recommended) into `public/images/portfolio/<category>/`
2. Add an import line + a `portfolioItems` entry in `src/data/portfolio.ts` (static import auto-handles width/height/blur)
3. Write a short `alt` description of the photo (SEO/accessibility)
4. To feature a photo in the home filmstrip, add its id to `featuredIds` in the same file

### Key Image Locations

| Purpose | File | Source |
| --- | --- | --- |
| Home hero | `public/images/hero/hero-01.jpg` | `img/field-02.jpg` |
| About top/bottom | `public/images/about/about-01.jpg`, `about-02.jpg` | `img/forest-02.jpeg`, `img/field-01.jpg` |
| Logo | `public/images/logo.png` (transparent PNG) | background removed from `img/logo.jpeg` |
| Brand mark (home statement) | `public/images/brand-mark.jpg` | `img/logo3.jpeg` |
| iOS home-screen icon | `src/app/apple-icon.png` (180×180) | `img/logo3.jpeg` |
| OG share image | `public/og.png` (1200×630) | center-cropped from `img/logo3.jpeg` |

## Pre-Launch Checklist

- [x] KakaoTalk channel / Instagram links in `src/data/site.ts`
- [ ] Update `url` in `src/data/site.ts` to the real domain (used for absolute sitemap/OG paths)
- [ ] Update `src/data/products.ts` whenever products/pricing change
