import sharp from "sharp";
const d = new URL("../", import.meta.url).pathname;
const jobs = [
  ["creative/reference/front-01.png", "public/images/heart-hero", 1024],
  ["creative/reference/back-01.png", "public/images/heart-back", 1024],
  ["creative/reference/presentation-01.png", "public/images/heart-presentation", 1168],
  ["creative/reference/macro-01.png", "public/images/heart-macro", 1168],
];
for (const [src, out, w] of jobs) {
  await sharp(d + src).resize(w).webp({ quality: 82 }).toFile(d + out + ".webp");
  await sharp(d + src).resize(w).avif({ quality: 55 }).toFile(d + out + ".avif");
}
await sharp(d + "creative/reference/front-01.png").resize(1200, 630, { fit: "contain", background: "#ffffff" }).jpeg({ quality: 85 }).toFile(d + "public/images/og.jpg");
