// node shot3.mjs <html> <png> <breedte> <hoogte> <scheme> <selector> <wachtms>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, png, w, h, scheme, sel, wacht] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, colorScheme: scheme });
const logs = []; page.on('pageerror', e => logs.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() !== 'log') logs.push(m.type() + ': ' + m.text()); });
await page.goto('file://' + html);
await page.waitForTimeout(800);
await page.evaluate(s => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90); }, sel);
await page.waitForTimeout(+wacht);
await page.screenshot({ path: png });
if (logs.length) console.log(logs.join('\n'));
await browser.close();
