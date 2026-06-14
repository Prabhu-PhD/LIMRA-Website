/* Build SEO image assets: favicon PNGs + Open Graph share image.
   Run with: node tools/seo-build.js   (needs `npm i sharp`, not committed) */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

async function favicons() {
  const svg = fs.readFileSync(path.join(root, "favicon.svg"));
  await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(path.join(root, "favicon-32.png"));
  await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(path.join(root, "apple-touch-icon.png"));
  await sharp(svg, { density: 384 }).resize(192, 192).png().toFile(path.join(root, "favicon-192.png"));
}

async function ogImage() {
  const W = 1200, H = 630;
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a1450"/><stop offset="55%" stop-color="#0c1a64"/><stop offset="100%" stop-color="#0a1147"/>
      </linearGradient>
      <radialGradient id="rg" cx="78%" cy="28%" r="62%">
        <stop offset="0%" stop-color="#298cff" stop-opacity="0.38"/><stop offset="100%" stop-color="#298cff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="red" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#C0241D"/><stop offset="55%" stop-color="#EE4038"/><stop offset="100%" stop-color="#FF5A4E"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="${H}" fill="url(#rg)"/>
    <rect x="0" y="0" width="${W}" height="9" fill="url(#red)"/>
    <text x="600" y="402" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="46" fill="#ffffff">No.1 FMGE Coaching &#183; MBBS Abroad</text>
    <text x="600" y="456" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="27" fill="#9fb6e0">Philippines &#183; Timor-Leste &#183; 24+ years &#183; 2000+ doctors</text>
  </svg>`;
  const base = await sharp(Buffer.from(bg)).png().toBuffer();
  const logo = await sharp(fs.readFileSync(path.join(root, "assets/logo-white.svg")), { density: 384 })
    .resize({ width: 470 }).png().toBuffer();
  const lmeta = await sharp(logo).metadata();
  await sharp(base)
    .composite([{ input: logo, top: 168, left: Math.round((W - lmeta.width) / 2) }])
    .jpeg({ quality: 86 })
    .toFile(path.join(root, "assets/og-image.jpg"));
}

(async () => {
  await favicons();
  await ogImage();
  console.log("SEO assets built.");
})();
