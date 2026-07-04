import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--no-sandbox'] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto('https://weather.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const report = await page.evaluate(() => {
    const out = [];

    // Children of the grid container (contentTop / main / sidebar areas)
    out.push('=== Grid container children ===');
    const grid = document.querySelector('.w-full.grid.mx-auto.gap-6');
    if (grid) {
      Array.from(grid.children).forEach((el, i) => {
        const id = el.id ? `#${el.id}` : '';
        const testid = el.dataset.testid ? `[data-testid="${el.dataset.testid}"]` : '';
        const style = el.getAttribute('style') || '';
        const cls = el.className.slice(0, 100);
        out.push(`  [${i}] ${el.tagName.toLowerCase()}${id}${testid}`);
        out.push(`       style="${style.slice(0, 80)}"`);
        out.push(`       class="${cls}"`);
        // First-level children of this
        Array.from(el.children).slice(0, 5).forEach(child => {
          const cid = child.id ? `#${child.id}` : '';
          const ctestid = child.dataset.testid ? `[data-testid="${child.dataset.testid}"]` : '';
          out.push(`         child: ${child.tagName.toLowerCase()}${cid}${ctestid} class="${child.className.slice(0,80)}"`);
        });
      });
    }

    // Look for elements assigned to sidebar grid area
    out.push('\n=== Elements with grid-area: sidebar ===');
    document.querySelectorAll('*').forEach(el => {
      const style = el.getAttribute('style') || '';
      const cls = typeof el.className === 'string' ? el.className : '';
      if (style.includes('grid-area') || cls.includes('grid-area:sidebar') || cls.includes('[grid-area:sidebar]')) {
        out.push(`  ${el.tagName.toLowerCase()}#${el.id} style="${style}" class="${cls.slice(0,80)}"`);
      }
    });

    // WX_ ad containers summary
    out.push('\n=== WX_ ad data-testid containers ===');
    document.querySelectorAll('[data-testid$="-container"]').forEach(el => {
      const t = el.dataset.testid;
      if (t && t.startsWith('WX_')) {
        out.push(`  [data-testid="${t}"]  — ${el.tagName.toLowerCase()}`);
      }
    });

    return out.join('\n');
  });

  console.log(report);
  await browser.close();
})();
