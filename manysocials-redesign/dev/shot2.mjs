// node shot2.mjs <html> <uitvoer-prefix> <breedte> <hoogte> <scheme> <clipJSON|-> <tijden ms, komma> [dpr]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, pre, w, h, scheme, clip, tijden, dpr='1'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, colorScheme: scheme });
const logs = [];
page.on('console', m => logs.push(m.type() + ': ' + m.text()));
page.on('pageerror', e => logs.push('pageerror: ' + e.message));
await page.goto('file://' + html);
let vorige = 0;
for (const t of tijden.split(',').map(Number)) {
  await page.waitForTimeout(t - vorige); vorige = t;
  const opt = { path: `${pre}-${t}.png` };
  if (clip !== '-') opt.clip = JSON.parse(clip);
  await page.screenshot(opt);
}
if (logs.length) console.log(logs.join('\n'));
await browser.close();
