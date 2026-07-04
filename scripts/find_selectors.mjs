/**
 * Opens broken pages in a headed browser and probes the DOM for replacement selectors.
 * Run: node --input-type=module < find_selectors.mjs
 */

import { chromium } from 'playwright';

async function probe(page, label, queries) {
  const results = await page.evaluate((queries) => {
    return queries.map(q => {
      const els = document.querySelectorAll(q);
      return { query: q, count: els.length, sample: els[0] ? els[0].outerHTML.slice(0, 120) : null };
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
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: ['--no-sandbox'],
  });

  // ── YouTube sidebar ─────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== YouTube — sidebar (home page) ======');
    await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await probe(page, 'sidebar candidates', [
      '#guide-inner-content',          // old
      '#guide-content',
      '#guide',
      'ytd-guide-renderer',
      'tp-yt-app-drawer',
      '#content.ytd-app',
      '[id*="guide"]',
      'ytd-mini-guide-renderer',
    ]);
    await probe(page, 'home feed candidates', [
      'ytd-rich-grid-renderer',        // known-good
    ]);
    await ctx.close();
  }

  // ── YouTube watch page ───────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== YouTube — watch page ======');
    await page.goto('https://www.youtube.com/watch?v=jNQXAC9IVRw', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    await probe(page, 'end screen candidates', [
      'div.ytp-endscreen-content',     // old
      '.ytp-endscreen',
      '.ytp-ce-element',
      '[class*="endscreen"]',
      '[class*="end-screen"]',
    ]);
    await probe(page, 'related sidebar', [
      '#related',                      // known-good — confirm
    ]);
    await ctx.close();
  }

  // ── Weather.com ──────────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== Weather.com ======');
    await page.goto('https://weather.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Dump top-level IDs and classes to get orientation
    const topLevel = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('body > * > *'))
        .slice(0, 20)
        .map(el => `${el.tagName.toLowerCase()}#${el.id} .${[...el.classList].join('.')}`.slice(0, 100));
    });
    console.log('\n  [top-level structure]');
    topLevel.forEach(s => console.log('   ', s));

    await probe(page, 'sidebar candidates', [
      '.region-sidebar',               // old
      '[class*="sidebar"]',
      '[class*="Sidebar"]',
      '[id*="sidebar"]',
      'aside',
    ]);
    await probe(page, 'recommendations / content media', [
      '[id*="WxuContentMedia-main"]',  // old
      '[id*="ContentMedia"]',
      '[class*="ContentMedia"]',
      '[class*="Feed"]',
      '[class*="feed"]',
    ]);
    await probe(page, 'current conditions', [
      '[class*="CurrentConditions--messaging"]', // old
      '[class*="CurrentConditions"]',
      '[class*="currentConditions"]',
      '[data-testid*="CurrentConditions"]',
    ]);
    await ctx.close();
  }

  // ── Instagram (logged-out) ───────────────────────────────────────────────────
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log('\n====== Instagram (logged-out) ======');
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    await probe(page, 'main content candidates', [
      'main',                          // old
      'main[role="main"]',
      '[role="main"]',
      '#react-root',
      'div[class*="x9f619"]',
    ]);
    await probe(page, 'explore bar', [
      'a[href="/explore/"]',           // old
      'a[href*="explore"]',
      '[aria-label*="Explore"]',
    ]);
    await ctx.close();
  }

  await browser.close();
  console.log('\nDone.');
})();
