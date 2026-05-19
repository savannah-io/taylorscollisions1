// One-shot: compress hero photos to AVIF + a fallback compressed JPG.
// PNG sources are 2-3MB; converted output should be 50-200KB.
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const TARGETS = [
  { src: 'public/images/back3.png', avif: 'public/images/back3.avif', jpg: 'public/images/back3.jpg', width: 1920 },
  { src: 'public/images/TC-MOBILE-BG.png', avif: 'public/images/TC-MOBILE-BG.avif', jpg: 'public/images/TC-MOBILE-BG.jpg', width: 900 },
];

for (const t of TARGETS) {
  const before = (await stat(t.src)).size;
  await sharp(t.src).resize({ width: t.width, withoutEnlargement: true }).avif({ quality: 55, effort: 4 }).toFile(t.avif);
  await sharp(t.src).resize({ width: t.width, withoutEnlargement: true }).jpeg({ quality: 78, progressive: true, mozjpeg: true }).toFile(t.jpg);
  const a = (await stat(t.avif)).size;
  const j = (await stat(t.jpg)).size;
  const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
  console.log(`${t.src.padEnd(40)} ${kb(before).padStart(8)} -> avif ${kb(a).padStart(8)}  jpg ${kb(j).padStart(8)}`);
}
