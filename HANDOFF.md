# LIMRA Website — Claude Handoff Document
_Generated 2026-06-13. For the next Claude session working on this project._

---

## Project at a Glance

**Client:** LIMRA Overseas Education (Chennai, India) — MBBS abroad (Philippines / Timor-Leste), FMGE coaching, medical tourism. Director: Mohammed Ghani.  
**Live URL:** https://limra-edu.netlify.app/ (also: https://www.limraedu.com — DNS pending)  
**GitHub:** https://github.com/Prabhu-PhD/LIMRA-Website.git (remote alias: `github`)  
**Developer:** Prabhu (Prabhu-PhD) — non-developer site owner; Claude is the designer/dev.  
**Budget:** $0/month — static Netlify, Netlify Forms, eventual Decap CMS, free tier everything.

---

## Repo Layout

```
C:\Users\prabh\source\repos\LIMRA\        ← git root = Netlify publish root
  index.html                               ← DONE — full new design
  about.html, colleges.html, coaching.html,
  medical-tourism.html, gallery.html,
  testimonials.html, blog.html, contact.html  ← OLD Replit design (need rebuild)
  colleges/
    lyceum.html, dmsf.html, brokenshire.html,
    gcm.html, ucts.html, university-of-peace.html  ← OLD design (need rebuild)
  css/
    tokens.css   ← design-system source of truth (DO NOT break this)
    home.css     ← homepage styles (~35KB), fully on tokens
    style.css    ← old Replit stylesheet, still used by ALL other pages
  js/
    home.js      ← homepage interactions (11KB)
    main.js, content.js, seo.js, college-detail.js, config.js  ← old, used by other pages
  data/
    colleges.json   ← 6 colleges with real logos/badges (updated)
    *.json          ← other content (testimonials, stats, etc.)
  assets/           ← all real curated assets (see list below)
  design/
    styleguide.html ← living style guide
  netlify.toml      ← publish=".", no build command
  .gitignore        ← colleges/*.png|jpg|webp|svg gitignored (raw client sources)
  hero-preview.html ← gitignored, local reference prototype only
```

**Assets in `/assets/`:**
- Campus photos: `campus-1.jpg`, `campus-2.jpg`, `campus-brokenshire.jpg`, `campus-dmsf.jpg`
- Facilities: `facility-lab.jpg`, `students-library.jpg`
- Graduation: `graduation-1.jpg`, `graduation-2.jpg`, `graduation-3.jpg`, `graduation-wide.jpg`
- Logos (Pillow-processed PNGs, 420px square): `logo-lyceum.png`, `logo-dmsf.png`, `logo-brokenshire.png`, `logo-gcm.png`, `logo-ucts.png`, `logo-peace.png`
- SVG world map: `world-dots.svg` (transparent gray dots, viewBox 3606.62×1768.98, ~2.04:1 ratio)
- LIMRA logos: `logo.svg`, `logo-white.svg`

---

## Design System (tokens.css)

**Colors:**
- `--clr-navy: #25245D` (primary dark)
- `--clr-red: #EE4038`
- `--clr-orange: #F7A53C`
- `--clr-sky: #29C2F5`
- `--clr-bg-dark: #0E0D24` (darkest bg, hero)
- Accent gradient: `linear-gradient(135deg, #EE4038 0%, #FF7A2F 55%, #F7A53C 100%)`

**Fonts (Google Fonts):**
- `Sora` — display/headings
- `Manrope` — body
- `Space Mono` — mono labels/numbers

**Key tokens:** `--radius-card`, `--shadow-card`, `--dur-base`, `--dur-slow`, `--ease-out` — all defined in `tokens.css`. Always use tokens in new CSS.

---

## Homepage Architecture (index.html — COMPLETE)

**Resource paths are RELATIVE** (`css/tokens.css`, `js/home.js`, `assets/...`) — this is intentional so it works in Claude preview panel AND on Netlify.

**Section order:**
1. Sticky nav (transparent → glass on scroll, mobile drawer, Colleges dropdown)
2. Dark hero — orbit constellation SVG (560×560 viewBox, 9 orbit nodes using pravatar placeholders, HUB_R=92, constellation lines from outer ring, LIMRA logo on opaque navy disc `fill="#12112E"`)
3. Enquiry strip — `margin-top: -90px` overlapping faded LIMRA wordmark; Netlify Forms ready (`name="enquiry"`, `data-netlify="true"`, honeypot field `bot-field`)
4. Partner colleges — 6 real logo cards, clickable to `/colleges/*.html`
5. Trust badges band — NMC/English/WHO/Affordable/Clinical
6. 10 Countries world map — dark section, SVG `world-dots.svg` with `filter:brightness(0)invert(1);opacity:.5`; 11 absolute-% pins; Philippines (83%,49%) and Timor-Leste (85.5%,61%) are `.primary` pulsing pins
7. Services — bento grid
8. Stats band — 6 count-up numbers via IntersectionObserver
9. FMGE — 92% radial gauge SVG (`stroke-dasharray="263.9" stroke-dashoffset="21.1"`) + 4 stat tiles
10. How-it-works roadmap — gradient connector line, numbered nodes
11. Testimonials carousel — auto 4.5s, 3/2/1 perView, dots/arrows, pause-on-hover, `line-clamp:6`
12. Gallery marquee — two `.marquee-row` rows (`.rtl` 52s / `.ltr` 46s, JS-cloned for seamless loop, lightbox)
13. CTA band
14. Footer — gradient top bar, dot texture, giant faded LIMRA wordmark, social icons

**Background effects** (all dark sections):
- `::before` dot grid: `radial-gradient(circle, rgba(255,255,255,.16) 1px, transparent 1px); background-size: 26px 26px`
- Hero grain layer via `@keyframes grain` noise animation
- Single deep-red radial glow: `radial-gradient(ellipse 60% 55% at 62% 48%, rgba(238,64,56,.22) 0%, transparent 70%)`

**GSAP 3.12.5** from cdnjs — hero entrance animations only; graceful fallback if CDN blocked.

---

## home.js Key Details

- `HUB_R = 92` — orbit lines start at outer ring of hub circle, not dead center
- Orbit uses `https://i.pravatar.cc/160?img=N` placeholders for 9 student faces (client hasn't sent real photos yet)
- Carousel: `perView()` → 3/2/1 by breakpoint; dots built dynamically per slide-group
- Gallery lightbox: skips cloned items (`data-clone` attr); dedupes by `src`
- Marquee: JS clones each `.marquee-row`'s children with `data-clone`+`aria-hidden` for seamless CSS loop
- Enquiry form: checks `hostname` includes `netlify.app` or `limraedu.com` before submitting real; shows inline stub confirmation locally

---

## data/colleges.json — Current State

6 colleges complete with real data:
| id | name | country | logo |
|----|------|---------|------|
| lyceum | Lyceum Northwestern University | Philippines (Dagupan) | `/assets/logo-lyceum.png` |
| dmsf | Davao Medical School Foundation | Philippines (Davao) | `/assets/logo-dmsf.png` |
| brokenshire | Brokenshire College | Philippines (Davao) | `/assets/logo-brokenshire.png` |
| gcm | **Gullas** College of Medicine | Philippines (Cebu) | `/assets/logo-gcm.png` |
| ucts | Universidade Católica Timorense | Timor-Leste (Dili) | `/assets/logo-ucts.png` |
| university-of-peace | University of PEACE | Timor-Leste (Dili) | `/assets/logo-peace.png` |

**Note:** Nav dropdown in index.html still says "Global College of Medicine" for GCM — needs correction to "Gullas College of Medicine" (line ~38 of index.html).

---

## What's Done vs. What's Pending

### DONE
- [x] Full homepage redesign on new design system (`index.html` + `css/home.css` + `js/home.js`)
- [x] Design tokens (`css/tokens.css`)
- [x] 6 real college logos processed and in `/assets/`
- [x] Real campus/graduation photos curated into `/assets/`
- [x] SVG world map with 11 empirically-positioned pins
- [x] CSS marquee gallery with lightbox
- [x] Netlify Forms enquiry form (live submission works on deploy)
- [x] Site deployed to https://limra-edu.netlify.app/ (GitHub → Netlify auto-deploy working)
- [x] netlify.toml committed and pushed
- [x] `data/colleges.json` updated with real logos, badges, GCM corrected

### PENDING (in priority order)

1. **Fix GCM name in nav** — index.html line ~38: `"Global College of Medicine"` → `"Gullas College of Medicine"`

2. **Netlify Forms email notification** — Prabhu needs to do this in Netlify dashboard:
   _Site configuration → Forms → Form notifications → Add notification → Email notification_
   Without this, form submissions go nowhere visible.

3. **Rebuild inner pages** to match new design system — ALL these pages still use old `css/style.css` Replit design:
   - `about.html`
   - `colleges.html` (overview/listing page)
   - `colleges/lyceum.html`, `dmsf.html`, `brokenshire.html`, `gcm.html`, `ucts.html`, `university-of-peace.html`
   - `coaching.html`
   - `medical-tourism.html`
   - `gallery.html`
   - `testimonials.html`
   - `blog.html`
   - `contact.html`
   
   Each should use `css/tokens.css` + a new page-specific CSS file (or a shared `css/pages.css`), match the nav/footer from index.html, and NOT use the old `main.js`/`content.js` JSON-injection system.

4. **Real student headshots for orbit** — 9 pravatar placeholders in the hero orbit. Client needs to provide real LIMRA student photos.

5. **Decap CMS** — planned for Phase 1; not started. Will sit at `/admin/` using GitHub OAuth, pointing at `data/*.json` files. Free via Netlify Identity or Cloudflare Access.

6. **Custom domain** — site is `limra-edu.netlify.app`; target is `www.limraedu.com`. DNS change needed in domain registrar.

7. **Data inconsistency to confirm with client** — Lyceum brochure says "10,000+ doctors" but site says "2000+" everywhere. Confirm correct figure.

---

## Deployment

- **Auto-deploy:** every push to `main` on GitHub triggers a Netlify redeploy. No build step.
- **Git push:** `git push github main` (credentials cached, no `gh` CLI installed)
- **Force push (use carefully):** `git push --force github main`

---

## Local Dev Server

Start with: `python -m http.server 5500` from repo root (`C:\Users\prabh\source\repos\LIMRA\`).  
Or use the Claude Preview panel (`.claude/launch.json` configured).  
All paths are relative so Claude preview also works.

---

## Known One-Off Bugs / Gotchas

- `hero-preview.html` is gitignored but exists locally — it's a prototype, don't deploy or delete without asking.
- Raw client logo/map files in `colleges/` are gitignored (`colleges/*.png|jpg|webp|svg`). Processed versions are in `assets/`.
- PyMuPDF (fitz) cannot read `.webp` — use Pillow for those. fitz can render SVG to PNG via `fitz.open('x.svg')[0].get_pixmap()`.
- The `.map-wrap` MUST keep `aspect-ratio: 3607/1769` or map pins will misalign.
- `index.html` orbit uses GSAP from cdnjs — if blocked/slow, falls back to CSS-only (no entrance animation but everything still shows).
- `css/style.css` (~1600 lines) is still used by all non-homepage pages. Don't delete it until inner pages are rebuilt.
