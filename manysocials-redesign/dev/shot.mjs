// Gebruik: node shot.mjs <html> <png> [breedte] [hoogte] [wachtms] [fullPage] [scheme]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, png, w='1280', h='900', wacht='1500', full='0', scheme='light'] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, colorScheme: scheme });
const logs = [];
page.on('console', m => logs.push(m.type() + ': ' + m.text()));
page.on('pageerror', e => logs.push('pageerror: ' + e.message));
await page.goto('file://' + html);
await page.waitForTimeout(+wacht);
await page.screenshot({ path: png, fullPage: full === '1' });
if (logs.length) console.log(logs.join('\n'));
await browser.close();
