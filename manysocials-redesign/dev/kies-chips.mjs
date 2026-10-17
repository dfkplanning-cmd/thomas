// Klik een pizza in de band en volg wat de telefoon doet.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, pre] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = []; page.on('pageerror', e => logs.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') logs.push(m.text()); });
await page.goto('file://' + html); await page.waitForTimeout(5000);
await page.locator('.band-zak[data-smaak="1"]').first().click({ force: true });
const clip = { x: 760, y: 60, width: 640, height: 780 };
let t = 0;
for (const ms of [6500, 11500]) { await page.waitForTimeout(ms - t); t = ms; await page.screenshot({ path: `${pre}-${ms}.png`, clip }); }
console.log('gekozen:', await page.locator('.band-zak[aria-pressed="true"]').first().getAttribute('data-smaak'));
if (logs.length) console.log(logs.join('\n'));
await browser.close();
