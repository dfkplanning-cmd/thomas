import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, html, w] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
const page = await browser.newPage({ viewport: { width: +w, height: 900 } });
await page.goto('file://' + html); await page.waitForTimeout(2500);
const r = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth, uit = [];
  for (const el of document.querySelectorAll('body *')) {
    const b = el.getBoundingClientRect();
    if (b.right > vw + 1 && b.width > 0) {
      // alleen de buitenste boosdoeners
      let p = el.parentElement, binnen = false;
      while (p && p !== document.body) { const pb = p.getBoundingClientRect(); const st = getComputedStyle(p); if (/(hidden|clip)/.test(st.overflowX) ) { binnen = true; break; } p = p.parentElement; }
      if (!binnen) uit.push(el.tagName + '.' + el.className + ' right=' + Math.round(b.right));
    }
  }
  return { sw: document.documentElement.scrollWidth, vw, uit: uit.slice(0, 15) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
