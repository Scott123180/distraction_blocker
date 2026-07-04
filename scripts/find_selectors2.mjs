import { chromium } from 'playwright';

async function probe(page, label, queries) {
  const results = await page.evaluate((queries) => {
    return queries.map(q => {
      const els = document.querySelectorAll(q);
      return { query: q, count: els.length, sample: els[0] ? els[0].outerHTML.slice(0, 150) : null };
    });
  }, queries);

  console.log(`\n  [${label}]`);
  for (const r of results) {
    if (r.count > 0) {
      console.log(`    FOUND (${r.count}) "${r.query}"`);
      console.log(`           ${r.sample}`);
    } else {
      console.log(`    --    (0) "${r.query}"`);
    }
  }
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--no-sandbox'] });

  // ── Weather.com ──────────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== Weather.com ======');
    await page.goto('https://weather.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);

    const topLevel = await page.evaluate(() =>
      Array.from(document.querySelectorAll('body > * > *'))
        .slice(0, 30)
        .map(el => `${el.tagName.toLowerCase()}  id="${el.id}"  class="${[...el.classList].slice(0,3).join(' ')}"`.slice(0, 120))
    );
    console.log('\n  [top-level structure sample]');
    topLevel.forEach(s => console.log('   ', s));

    await probe(page, 'sidebar candidates', [
      '.region-sidebar',
      '[class*="sidebar"]',
      '[class*="Sidebar"]',
      'aside',
      '[id*="sidebar"]',
    ]);
    await probe(page, 'content / recommendations', [
      '[id*="WxuContentMedia-main"]',
      '[id*="ContentMedia"]',
      '[class*="ContentMedia"]',
      '[class*="MoreStories"]',
      '[class*="DigitalAdSlot"]',
      '[id*="feed"]',
      '[class*="feed"]',
    ]);
    await probe(page, 'current conditions', [
      '[class*="CurrentConditions--messaging"]',
      '[class*="CurrentConditions"]',
      '[data-testid*="CurrentConditions"]',
      '[data-testid="CurrentConditions"]',
    ]);
    await ctx.close();
  }

  // ── Instagram (logged-out) ───────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== Instagram (logged-out) ======');
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    const topLevel = await page.evaluate(() =>
      Array.from(document.querySelectorAll('body > * > *'))
        .slice(0, 20)
        .map(el => `${el.tagName.toLowerCase()}  id="${el.id}"  class="${[...el.classList].slice(0,3).join(' ')}"`.slice(0, 120))
    );
    console.log('\n  [top-level structure sample]');
    topLevel.forEach(s => console.log('   ', s));

    await probe(page, 'main content', [
      'main',
      '[role="main"]',
      '#react-root',
      '#react-root > div',
    ]);
    await probe(page, 'explore bar', [
      'a[href="/explore/"]',
      'a[href*="explore"]',
      '[aria-label*="Explore"]',
      '[aria-label*="explore"]',
    ]);
    await ctx.close();
  }

  await browser.close();
  console.log('\nDone.');
})();
