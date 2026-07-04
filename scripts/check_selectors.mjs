/**
 * Checks whether the CSS/DOM selectors used by distraction_blocker still exist
 * on each target site. Uses Playwright with installed Chrome.
 *
 * Run: node check_selectors.mjs
 */

import { chromium } from 'playwright';

const TIMEOUT = 15000; // ms to wait for each selector

const CHECKS = [
  // YouTube — home page
  {
    site: 'YouTube',
    page: 'homePage',
    url: 'https://www.youtube.com/',
    selectors: [
      { label: 'Home feed (ytd-rich-grid-renderer)', query: 'ytd-rich-grid-renderer' },
      { label: 'Sidebar (guide-inner-content)', query: '#guide-inner-content' },
    ],
  },
  // YouTube — watch page (using a well-known stable video)
  {
    site: 'YouTube',
    page: 'watchPage',
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    selectors: [
      { label: 'Related sidebar (#related)', query: '#related' },
      { label: 'End screen (div.ytp-endscreen-content)', query: 'div.ytp-endscreen-content' },
      { label: 'Sidebar (guide-inner-content)', query: '#guide-inner-content' },
    ],
  },
  // YouTube — shorts
  {
    site: 'YouTube',
    page: 'shortsPage',
    url: 'https://www.youtube.com/shorts/',
    selectors: [
      { label: 'Shorts container (#shorts-container)', query: '#shorts-container' },
      { label: 'Offline container (#offline-container)', query: '#offline-container' },
    ],
  },
  // Weather.com
  {
    site: 'Weather.com',
    page: 'default',
    url: 'https://weather.com/',
    selectors: [
      { label: 'Sidebar (.region-sidebar)', query: '.region-sidebar' },
      { label: 'Content media (id contains WxuContentMedia-main)', query: '[id*="WxuContentMedia-main"]' },
      { label: 'Current conditions messaging (class contains CurrentConditions--messaging)', query: '[class*="CurrentConditions--messaging"]' },
    ],
  },
  // Reddit
  {
    site: 'Reddit',
    page: 'default',
    url: 'https://www.reddit.com/',
    selectors: [
      { label: 'Body (body — always present if page loads)', query: 'body' },
    ],
  },
  // Instagram (logged-out view)
  {
    site: 'Instagram',
    page: 'logged-out',
    url: 'https://www.instagram.com/',
    selectors: [
      { label: 'Main element (main)', query: 'main' },
      { label: 'Explore bar (a[href="/explore/"])', query: 'a[href="/explore/"]' },
    ],
  },
  // Facebook (logged-out view)
  {
    site: 'Facebook',
    page: 'logged-out',
    url: 'https://www.facebook.com/',
    selectors: [
      { label: "Main content (div[role='main'])", query: "div[role='main']" },
    ],
  },
];

async function checkPage(browser, check) {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  console.log(`\n--- ${check.site} / ${check.page} ---`);
  console.log(`    URL: ${check.url}`);

  try {
    await page.goto(check.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Extra settle time for SPAs
    await page.waitForTimeout(4000);
  } catch (e) {
    console.log(`    ERROR loading page: ${e.message}`);
    await context.close();
    return;
  }

  for (const sel of check.selectors) {
    try {
      const el = await page.waitForSelector(sel.query, { timeout: TIMEOUT });
      const found = el !== null;
      console.log(`    [${found ? 'FOUND  ' : 'MISSING'}] ${sel.label}`);
    } catch {
      console.log(`    [MISSING] ${sel.label}`);
    }
  }

  await context.close();
}

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox'],
  });

  for (const check of CHECKS) {
    await checkPage(browser, check);
  }

  await browser.close();
  console.log('\nDone.');
})();
