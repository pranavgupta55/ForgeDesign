#!/usr/bin/env node
// Capture every showcase section to screenshots/*.png.
// Run after any visual change to keep the repo's screenshots in sync.
//
//   npm install   # one-time: pulls Playwright + Chromium
//   npm run screenshots
//
// Outputs:
//   screenshots/overview.png         full page
//   screenshots/typography.png       #typography
//   screenshots/colors.png           #colors
//   screenshots/components.png       #components
//   screenshots/layout.png           #layout
//   screenshots/stats-row.png        #demo-stats
//   screenshots/filter-bar.png       #demo-filter
//   screenshots/section-windows.png  #demo-tables
//   screenshots/action-cluster.png   #layout .action-cluster-row
//   screenshots/icon-grid.png        #components .icon-grid
//   screenshots/status-dots.png      #layout .dots-row

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'screenshots');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const URL = pathToFileURL(join(ROOT, 'index.html')).href;

const TARGETS = [
  { name: 'overview',        full: true },
  { name: 'typography',      sel: '#typography' },
  { name: 'colors',          sel: '#colors' },
  { name: 'components',      sel: '#components' },
  { name: 'layout',          sel: '#layout' },
  { name: 'stats-row',       sel: '#demo-stats' },
  { name: 'filter-bar',      sel: '#demo-filter' },
  { name: 'section-windows', sel: '#demo-tables' },
  { name: 'action-cluster',  sel: '#layout .action-cluster-row' },
  { name: 'icon-grid',       sel: '#components .icon-grid' },
  { name: 'status-dots',     sel: '#layout .dots-row' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
// Web fonts need a tick to settle after `networkidle`.
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(150);

for (const t of TARGETS) {
  const out = join(OUT, `${t.name}.png`);
  if (t.full) {
    await page.screenshot({ path: out, fullPage: true });
  } else {
    const el = page.locator(t.sel).first();
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: out, animations: 'disabled' });
  }
  console.log(`saved ${t.name}.png`);
}

await browser.close();
