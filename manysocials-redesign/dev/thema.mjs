// Systeem op donker: de pagina moet licht openen; daarna de knop testen.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, pre] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
const logs = []; page.on('pageerror', e => logs.push('pageerror: ' + e.message));
await page.goto('file://' + html); await page.waitForTimeout(2500);
await page.screenshot({ path: pre + '-standaard.png' });
await page.click('#kk-thema'); await page.waitForTimeout(500);
await page.screenshot({ path: pre + '-donker.png' });
console.log('klasse na klik:', await page.evaluate(() => document.documentElement.className));
if (logs.length) console.log(logs.join('\n')); await browser.close();
