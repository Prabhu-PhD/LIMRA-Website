/* Injects favicon links, complete Open Graph + Twitter tags, and (on the
   homepage) JSON-LD structured data into every page's <head>. Idempotent:
   strips the tags it manages first, so re-running won't duplicate.
   Run with: node tools/seo-meta-inject.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const BASE = "https://www.limraedu.com";
const OG_IMG = BASE + "/assets/og-image.jpg";

const indexablePages = [
  "index.html", "about.html", "colleges.html", "coaching.html",
  "medical-tourism.html", "gallery.html", "testimonials.html", "contact.html",
  "colleges/lyceum.html", "colleges/dmsf.html", "colleges/brokenshire.html",
  "colleges/gcm.html", "colleges/ucts.html", "colleges/university-of-peace.html",
];
const faviconOnly = ["home2.html", "thank-you.html", "404.html"];

function esc(s) {
  return s.replace(/&amp;/g, "&").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function grab(html, re) { const m = html.match(re); return m ? m[1].trim() : ""; }

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: "LIMRA Overseas Education",
  url: BASE,
  logo: BASE + "/favicon-192.png",
  image: OG_IMG,
  description: "LIMRA guides students to premier medical colleges in the Philippines and Timor-Leste, backed by South India's No.1 FMGE coaching. 2000+ doctors guided in 24+ years.",
  telephone: ["+91-9444375000", "+91-9445783333"],
  email: "info@limraedu.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "New No.177, Royapettah High Road, 1st Floor, SMS Centre, Mylapore",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600004",
    addressCountry: "IN",
  },
  areaServed: ["India", "Philippines", "Timor-Leste"],
  founder: { "@type": "Person", name: "Mohammed Ghani" },
};

function process(file, withOG, withSchema) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) return null;
  let html = fs.readFileSync(p, "utf8");

  html = html.replace(/\s*<link[^>]*rel="(?:icon|apple-touch-icon)"[^>]*>/g, "");
  html = html.replace(/\s*<meta[^>]*property="og:[^"]*"[^>]*>/g, "");
  html = html.replace(/\s*<meta[^>]*name="twitter:[^"]*"[^>]*>/g, "");
  html = html.replace(/\s*<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, "");

  const title = grab(html, /<title>([^<]*)<\/title>/i);
  const desc = grab(html, /name="description"\s+content="([^"]*)"/i);
  let canon = grab(html, /rel="canonical"\s+href="([^"]*)"/i);
  if (!canon) canon = BASE + "/" + (file === "index.html" ? "" : file);

  const lines = [
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
  ];
  if (withOG) {
    lines.push(
      '<meta property="og:type" content="website" />',
      '<meta property="og:site_name" content="LIMRA Overseas Education" />',
      '<meta property="og:title" content="' + esc(title) + '" />',
      '<meta property="og:description" content="' + esc(desc) + '" />',
      '<meta property="og:url" content="' + esc(canon) + '" />',
      '<meta property="og:image" content="' + OG_IMG + '" />',
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      '<meta name="twitter:title" content="' + esc(title) + '" />',
      '<meta name="twitter:description" content="' + esc(desc) + '" />',
      '<meta name="twitter:image" content="' + OG_IMG + '" />'
    );
  }
  if (withSchema) {
    lines.push('<script type="application/ld+json">' + JSON.stringify(SCHEMA) + "</script>");
  }
  html = html.replace(/<\/head>/i, "  " + lines.join("\n  ") + "\n</head>");
  fs.writeFileSync(p, html);
  return file;
}

const done = [];
indexablePages.forEach((f, i) => { if (process(f, true, i === 0)) done.push(f); });
faviconOnly.forEach((f) => { if (process(f, false, false)) done.push(f); });
console.log("Updated " + done.length + " pages:\n  " + done.join("\n  "));
