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

Gallery photos (portfolio grid + home filmstrip) are managed by the site owner directly at `/admin` — no developer or code change needed. It's a password-gated admin area backed by Vercel Blob (both the image files and a small JSON metadata manifest), supporting upload, delete, and editing category/alt text/featured status per photo.

- `/admin/login` — sign in with the shared `ADMIN_PASSWORD` (env var, set in Vercel + `.env.local`)
- `/admin` — upload new photos (pick a category, select one or more files) and manage existing ones (category, alt text, "show on home" toggle, delete)
- Gallery categories: `field` / `forest` (forest & park) / `campus` / `city`
- Uploaded photos are re-encoded server-side (EXIF stripped, resized to a 2000px long edge) — no manual pre-processing needed before upload
- `img/` — folder for photo originals (kept out of git, not served directly)
- `scripts/migrate-portfolio-to-blob.mjs` — one-off script used for the initial migration from static files to Blob; not part of the normal workflow

### Key Image Locations

| Purpose | File | Source |
| --- | --- | --- |
| Home hero | `public/images/hero/hero-01.jpg` | `img/field-02.jpg` |
| About top/bottom | `public/images/about/about-01.jpg`, `about-02.jpg` | `img/forest-02.jpeg`, `img/field-01.jpg` |
| Logo | `public/images/logo.png` (transparent PNG) | background removed from `img/logo.jpeg` |
| Brand mark (home statement) | `public/images/brand-mark.jpg` | `img/logo3.jpeg` |
| iOS home-screen icon | `src/app/apple-icon.png` (180×180) | `img/logo3.jpeg` |
| OG share image | `public/og.png` (1200×630) | centre-cropped from `img/logo3.jpeg` |

## Pre-Launch Checklist

- [x] KakaoTalk channel / Instagram links in `src/data/site.ts`
- [ ] Update `url` in `src/data/site.ts` to the real domain (used for absolute sitemap/OG paths)
- [ ] Update `src/data/products.ts` whenever products/pricing change
