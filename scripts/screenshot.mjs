// Take desktop + mobile screenshots of localhost:3000 for visual verification.
// Usage: node scripts/screenshot.mjs <label>
//   <label> appended to filename, e.g. "bebas", "anton", "archivo"
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const label = process.argv[2] || 'pass';
const outDir = '/tmp/tc-shots';
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const URL = 'http://localhost:3000';

const browser = await chromium.launch({ args: ['--no-sandbox'] });

async function shoot(viewport, name) {
  const viewport_h = viewport.height;
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    userAgent: viewport.width <= 480
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);

  // viewport-only "above the fold"
  const path = `${outDir}/${name}-${label}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`wrote ${path}`);

  // scroll through to trigger IntersectionObserver animations + R3F mounts
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.floor(viewport_h * 0.85);
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await page.waitForTimeout(450);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  const fullPath = `${outDir}/${name}-${label}-full.png`;
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`wrote ${fullPath}`);

  // also capture mid-page (services section) for the 3D orbs
  const midY = Math.floor(total * 0.55);
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), midY);
  await page.waitForTimeout(700);
  const midPath = `${outDir}/${name}-${label}-mid.png`;
  await page.screenshot({ path: midPath, fullPage: false });
  console.log(`wrote ${midPath}`);

  await context.close();
}

try {
  await shoot({ width: 1280, height: 800 }, 'desktop');
  await shoot({ width: 390, height: 844 }, 'mobile');
} finally {
  await browser.close();
}
