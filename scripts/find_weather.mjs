import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--no-sandbox'] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto('https://weather.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const report = await page.evaluate(() => {
    const out = [];

    // Full children of <main>
    out.push('=== Direct children of <main> ===');
    const main = document.querySelector('#main-content-wrapper');
    if (main) {
      Array.from(main.children).forEach(el => {
        const id = el.id ? `#${el.id}` : '';
        const testid = el.dataset.testid ? `[data-testid="${el.dataset.testid}"]` : '';
        const cls = [...el.classList].slice(0, 4).join(' ');
        out.push(`  ${el.tagName.toLowerCase()}${id}${testid}  class="${cls}"  (${el.children.length} children)`);
      });
    } else {
      out.push('  <main> not found');
    }

    // data-testid attributes on the page
    out.push('\n=== All data-testid values ===');
    const testids = new Set();
    document.querySelectorAll('[data-testid]').forEach(el => testids.add(el.dataset.testid));
    [...testids].slice(0, 40).forEach(t => out.push(`  [data-testid="${t}"]`));

    // Taboola / ad containers
    out.push('\n=== Taboola / feed containers ===');
    document.querySelectorAll('[id*="taboola"],[class*="taboola"],[id*="tbl-"]').forEach(el => {
      out.push(`  ${el.tagName.toLowerCase()}#${el.id}  class="${[...el.classList].slice(0,3).join(' ')}"`);
    });

    // Grid/sidebar structure
    out.push('\n=== Grid / sidebar area ===');
    document.querySelectorAll('[class*="sidebar"],[class*="grid-area"],[class*="gridArea"]').forEach(el => {
      out.push(`  ${el.tagName.toLowerCase()}#${el.id}  class="${el.className.slice(0, 120)}"`);
    });

    return out.join('\n');
  });

  console.log(report);
  await browser.close();
})();
