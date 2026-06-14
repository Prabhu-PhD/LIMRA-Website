/* Build the favicon from the open-book "M" in the LIMRA logo.
   Crops the book glyph out of logo-white.svg, trims it, and centers it
   on a navy rounded square. Outputs favicon.svg + PNG sizes.
   Run with: node tools/favicon-book.js */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

(async () => {
  const W = 1600;
  const big = await sharp(fs.readFileSync(path.join(root, "assets/logo-white.svg")), { density: 768 })
    .resize({ width: W }).png().toBuffer();
  const m = await sharp(big).metadata();

  // book glyph sits in the centre of the wordmark; crop between the I and R
  const crop = await sharp(big).extract({
    left: Math.round(0.255 * W),
    top: Math.round(0.07 * m.height),
    width: Math.round(0.285 * W),
    height: Math.round(0.60 * m.height),
  }).png().toBuffer();

  const book = await sharp(crop).trim({ threshold: 10 }).png().toBuffer();
  const bm = await sharp(book).metadata();

  const fit = 0.62;
  const side = Math.round(Math.max(bm.width, bm.height) / fit);
  const r = Math.round(side * 0.22);
  const left = Math.round((side - bm.width) / 2);
  const top = Math.round((side - bm.height) / 2);

  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}"><rect width="${side}" height="${side}" rx="${r}" ry="${r}" fill="#1A1940"/></svg>`
  );
  const master = await sharp(bg).composite([{ input: book, left, top }]).png().toBuffer();

  await sharp(master).resize(32, 32).png().toFile(path.join(root, "favicon-32.png"));
  await sharp(master).resize(180, 180).png().toFile(path.join(root, "apple-touch-icon.png"));
  await sharp(master).resize(192, 192).png().toFile(path.join(root, "favicon-192.png"));
  await sharp(master).resize(256, 256).png().toFile(path.join(root, "_favicon-preview.png"));

  const b64 = book.toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" rx="${r}" fill="#1A1940"/><image x="${left}" y="${top}" width="${bm.width}" height="${bm.height}" href="data:image/png;base64,${b64}"/></svg>`;
  fs.writeFileSync(path.join(root, "favicon.svg"), svg);
  console.log(`book favicon built — square ${side}px, book ${bm.width}x${bm.height}`);
})();
