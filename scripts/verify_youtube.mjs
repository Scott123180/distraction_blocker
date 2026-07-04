import { chromium } from 'playwright';

const CHECKS = [
  { label: 'Sidebar #guide-inner-content',     url: 'https://www.youtube.com/',                        query: '#guide-inner-content' },
  { label: 'Home feed ytd-rich-grid-renderer', url: 'https://www.youtube.com/',                        query: 'ytd-rich-grid-renderer' },
  { label: '#related (watch sidebar)',         url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',    query: '#related' },
  { label: 'div.ytp-endscreen-content',        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',    query: 'div.ytp-endscreen-content' },
  { label: '#shorts-container',               url: 'https://www.youtube.com/shorts/',                 query: '#shorts-container' },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--no-sandbox'] });

  for (const c of CHECKS) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(c.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const found = await page.$(c.query);
    console.log(`[${found ? 'FOUND  ' : 'MISSING'}] ${c.label}`);
    await ctx.close();
  }

  await browser.close();
})();
