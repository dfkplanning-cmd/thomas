import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, png] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' });
const logs = []; page.on('pageerror', e => logs.push('pageerror: ' + e.message));
await page.goto('file://' + html); await page.waitForTimeout(1500);
await page.screenshot({ path: png });
if (logs.length) console.log(logs.join('\n')); await browser.close();
