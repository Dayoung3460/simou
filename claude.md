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
- `muted` `#8A8580` — secondary text, inactive states (warm grey)
- `line` `#E8E5E0` — dividers, borders
- No accent color. Buttons come in exactly two forms: ink outline or ink fill.

### Typography

- Logo: use the real image asset `public/images/logo.png` (transparent, ink-colored wordmark; static import in header/menu/footer at `h-4 w-auto`~`h-5`). Don't render the logo as text. Source: `img/logo.jpeg`
- Square brand mark (calla lily + SIMOU): derived from `img/logo3.jpeg` → home statement (`public/images/brand-mark.jpg`), iOS icon (`src/app/apple-icon.png`), OG image (`public/og.png`). `img/logo2.jpeg` is the white-background variant, currently unused
- English display text (section titles): Cormorant Garamond (`font-serif`), font-light, tracking `0.2~0.4em`, uppercase
- Korean/body text: Pretendard (`font-sans`, jsdelivr dynamic subset CDN). Default body letter-spacing `-0.01em`
- Section title pattern: English serif caps + Korean subtitle (`text-sm text-muted`) — use the `SectionTitle` component
- Body line-height should be generous (leading-7~9)
- Korean line breaks must happen at word boundaries — `word-break: keep-all` is applied to body in globals.css. Don't use `break-all` arbitrarily in new components

### Spacing & Layout

- Mobile-first: base styles target mobile (375~390px), expand at `md:` and above
- Section vertical padding `py-24` or more (`md:py-32~36`). Err on the side of too much whitespace rather than too little
- Content width: text `max-w-xl~2xl`, overall container `max-w-6xl px-5 md:px-10`
- No shadows, rounded corners, or heavy borders. Use `border-line` hairlines only for separation. (One deliberate exception: the home brand mark is `rounded-full`)
- Animation limited to `Reveal`-level (scroll fade-up) subtlety. No flashy motion

### Component Rules

- Images must use next/image + static import (automatic blur placeholder & dimensions)
- Only the home hero gets `priority`; everything else defaults to lazy
- Text CTA: `underline-offset-8` + hover underline / Button CTA: `border border-ink` outline
- Header is fixed: transparent over the home hero with elements inverted to white (logo via `brightness-0 invert`, nav `text-white/85`, hamburger `bg-white`; hero has an `ink/40` top scrim) → `cream/90 + backdrop-blur` with ink elements on scroll
- Hero uses `h-svh` (to handle the iOS address bar)

## Where to Edit Data

- Products/pricing/notices: `src/data/products.ts`
- Gallery photos: managed by the site owner at `/admin` (password-gated, backed by Vercel Blob — see README's "Photo Management" section), not by editing code. Categories: 들판 `field` / 숲·공원 `forest` / 캠퍼스 `campus` / 시티 `city`
- Photo originals live in `img/` (kept out of git, not served). `scripts/generate-placeholders.mjs` is retired — running it would overwrite the real hero/about/og images (these non-gallery images are still static imports in `public/images/`, unaffected by the Blob-backed gallery)
- Site name/links/philosophy copy: `src/data/site.ts`
- When the open event (limited to 2nd half of 2026) ends, don't just delete `openEvent` from `products.ts` — the home page (`src/app/page.tsx`) and the Pricing page's Open Event section both import it, so clean up both together

## Deployment & Domain

- Canonical domain is `https://simouarchives.com` — Vercel project `simou` under team scope `da-youngs-projects-a44f7667`. `src/data/site.ts`'s `url` field is the source of truth — it feeds `sitemap.ts`/`robots.ts`, so update it there (and nowhere else) if the domain ever changes again
- `pioufleur.com` is a separate, previously-purchased domain still attached to the same `simou` project and still serving the site — it does **not** redirect to `simouarchives.com` (deliberate; the user only wanted the canonical URL switched, not the old domain retired)
- `www.simouarchives.com` 308-redirects to the apex (configured via the *project's* Settings → Domains → edit `www.simouarchives.com` → Redirect to another domain — not the team-level Domains registrar page, which only shows DNS/nameservers)
- Git integration is connected (`vercel git connect`): pushing to `main` auto-deploys to production; PRs get preview deployments
- DNS for both domains stays at Cloudflare (nameservers were **not** moved to Vercel) — only A record values point at Vercel, with the proxy disabled (DNS only / grey cloud, not orange — Cloudflare will nag about "Proxying is required for most security/performance features"; ignore it, proxying breaks Vercel's own TLS termination). Don't assume record values — always confirm the exact required A/CNAME target with `vercel domains inspect <domain>`, since Vercel can issue account-specific targets
- To reassign a domain from one Vercel project to another in the same account: `vercel domains add <domain> <project> --force` — no DNS changes needed as long as the domain already points at Vercel's edge network

## Language Conventions

- Code comments and all Markdown files (`claude.md`, `README.md`, etc.) are written in English using New Zealand spelling (colour, organise, behaviour, favourite, grey, etc.), not American spelling
- This does not apply to actual Korean site content/copy (JSX text, `alt`/`aria-label` strings, `src/data/*.ts` values) — that stays in Korean and must keep tracking `blog.md`

## Verification Notes (pitfalls confirmed this session)

- Basic verification: `npm run build` → `npx next start -p 3007` → curl all routes and confirm 200
- Mobile visual verification: after starting the server, run `npm run screenshots -- <server-url>` — this script (`scripts/screenshot-mobile.mjs`) already handles the pitfalls below. It emulates 390px, captures every page + menu/lightbox states into `.screenshots/`, and auto-flags horizontal overflow
- It's expected/normal for `/portfolio` to show up as SSR (ƒ) in the build — the category filter is a server-side filter based on `searchParams`
- **Do not verify mobile layout with headless desktop Chrome at `--window-size=390`.** Desktop Chrome has a minimum window width of ~500px, so even with 390 specified it renders at 500, creating an optical illusion where centered content appears shifted ~55px to the right (easily mistaken for horizontal overflow). Always emulate with CDP `Emulation.setDeviceMetricsOverride({ width: 390, mobile: true })` instead
- **In full-page captures (`captureBeyondViewport: true`), `Reveal` (IntersectionObserver) sections render as opacity-0.** This is just a capture artifact — no scroll events fire, so the fade-in never triggers — not an actual bug. Auto-scroll to the bottom of the page before capturing to avoid this
- **`backdrop-filter` (and `filter`) on an ancestor turns it into the containing block for `position: fixed` descendants.** The scrolled header uses `backdrop-blur-sm`, so any fixed overlay rendered *inside* the header gets its `inset-0` pinned to the header box, not the viewport (the mobile menu shipped with this bug: transparent menu on every solid-header page). Fixed-position overlays must escape via `createPortal(..., document.body)`. Sneaky because the home-top state (transparent header, no blur) works fine — always test overlays on a page where the header has its background, e.g. the `pricing-menu` screenshot case
- Rebuilding (`npm run build`) under a running `next start` can leave the server serving a stale/mismatched build — restart the server after a rebuild before re-verifying
- **The portfolio manifest (`portfolio/manifest.json`) lives in its own dedicated *private* Blob store (`simou-manifest`, token `MANIFEST_BLOB_READ_WRITE_TOKEN`), separate from the store holding the actual photo files (`simou-portfolio`, token `BLOB_READ_WRITE_TOKEN`, still public).** The manifest is never fetched by a browser — only read server-side — so it doesn't need to be public. This split fixed two real issues hit during development when the manifest was public: (1) Vercel's Security Checkpoint (anti-bot protection) occasionally challenging the anonymous public fetch with an HTML page instead of the real blob (this briefly broke the live `/portfolio` page and once caused a 500 on an admin PATCH/DELETE); (2) public CDN edge-cache staleness for several seconds after a write, which could make a read immediately following a write (e.g. editing a photo moments after uploading it) spuriously 404. Both are structurally gone now: `get()` with `access: "private"` is authenticated (bypasses the public CDN's anti-bot path) and `useCache: false` only takes effect for private blobs, forcing a read straight from origin storage. `src/lib/blob-store.ts`'s `readManifestUntil()` retry-with-backoff is kept as a lighter defensive safety net, not a load-bearing fix
- A Blob store's access mode (public/private) is fixed at creation and can't be changed or mixed per-blob afterwards — this is why the manifest needed a second store rather than just flipping a flag on the existing one
- Connecting a second Blob store to the same Vercel project needs a **custom environment variable prefix** (done via the dashboard, not the `vercel blob create-store` CLI, which only auto-connects using the default `BLOB_READ_WRITE_TOKEN` name and errors if that's taken). **Pitfall**: `vercel env pull` overwrites `.env.local` based on whichever vars exist for the pulled environment (default: `development`) — if a var like `ADMIN_PASSWORD` was only ever added to Production/Preview (not Development), a pull silently drops it from `.env.local`. Add secrets to all three environments up front, or expect to re-add them after every pull
- **Never let a lenient/fallback-to-empty manifest read precede a write.** `readManifest()` (used by public pages) swallows any Blob error and returns an empty manifest so a storage hiccup never crashes a render — safe for reads, but if a mutation (upload/edit/delete) read the manifest this way, a transient failure would look identical to "zero photos exist" and the follow-up write would wipe every photo's metadata (this happened once during development). Mutations must use `readManifestForMutation()`/`readManifestUntil()`, which throw instead of swallowing