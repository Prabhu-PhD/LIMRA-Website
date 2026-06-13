# LIMRA Overseas Education — Website

Marketing website for LIMRA Overseas Education (Chennai, India): MBBS abroad
(Philippines & Timor-Leste), No.1 FMGE coaching in South India, and medical tourism.

## Stack

- Static site — HTML, CSS, vanilla JavaScript (no framework, no build step)
- Content loaded from JSON files in `data/`
- Design tokens in `css/tokens.css` (single source of truth for colors, type, spacing)
- Hosting: Netlify (static) — enquiry form via Netlify Forms, content editing via a Git-based CMS (Decap), planned

## Structure

```
index.html            Home
about / colleges / coaching / medical-tourism / gallery / testimonials / blog / contact (.html)
colleges/             Individual college pages
css/
  tokens.css          Design system — brand colors, fonts, spacing (edit here to retheme)
  style.css           Site styles
js/                   main, content (data loading), seo, college-detail, config
data/                 Editable content (colleges, stats, testimonials, blog, gallery, contact)
assets/               Logos and images
design/styleguide.html  Living style guide rendering tokens.css
```

## Run locally

Any static file server works, e.g.:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open the printed URL.

## Brand

Navy `#25245D` · Red `#EE4038` · Orange `#F7A53C` · Sky `#29C2F5`.
Fonts: Sora (display), Manrope (body), Space Mono (labels). See `css/tokens.css`.
