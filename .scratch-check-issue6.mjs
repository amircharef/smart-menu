import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  const shadow = el.shadowRoot;
  const btn = shadow.querySelector('button[aria-label="Open Next.js Dev Tools"]');
  btn.click();
});
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  const shadow = el.shadowRoot;
  const walker = document.createTreeWalker(shadow, NodeFilter.SHOW_TEXT);
  const parts = [];
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (t) parts.push(t);
  }
  return parts.join(" | ");
});
console.log("RESULT:", info.slice(0, 3000));
await page.screenshot({ path: "06-devtools-open.png" });
await browser.close();
