/* Convert the photographic JPGs in assets/ to WebP (visually lossless ~82).
   Run with: node tools/img-webp.js */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const names = [
  "campus-1", "campus-2", "campus-brokenshire", "campus-dmsf", "dmsf-campus",
  "facility-lab", "graduation-1", "graduation-2", "graduation-3",
  "graduation-wide", "students-library",
];

(async () => {
  let oldT = 0, newT = 0;
  for (const n of names) {
    const src = path.join(root, "assets", n + ".jpg");
    if (!fs.existsSync(src)) { console.log("skip (missing): " + n); continue; }
    const o = fs.statSync(src).size;
    await sharp(src).webp({ quality: 82 }).toFile(path.join(root, "assets", n + ".webp"));
    const nw = fs.statSync(path.join(root, "assets", n + ".webp")).size;
    oldT += o; newT += nw;
    console.log(n.padEnd(20) + " " + Math.round(o / 1024) + "K -> " + Math.round(nw / 1024) + "K");
  }
  console.log("-----");
  console.log("TOTAL " + Math.round(oldT / 1024) + "K -> " + Math.round(newT / 1024) + "K  (saved " +
    Math.round((1 - newT / oldT) * 100) + "%)");
})();
