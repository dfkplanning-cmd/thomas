import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, sel, ...props] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + html); await page.waitForTimeout(1500);
console.log(JSON.stringify(await page.evaluate(([sel, props]) => [...document.querySelectorAll(sel)].slice(0,4).map(el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return { cls: el.className, x: Math.round(b.left), w: Math.round(b.width), ...Object.fromEntries(props.map(p => [p, cs[p]])) }; }), [sel, props]), null, 1));
await browser.close();
