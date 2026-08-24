import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  const shadow = el.shadowRoot;
  const walker = document.createTreeWalker(shadow, NodeFilter.SHOW_TEXT);
  const parts = [];
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (t && n.parentElement?.tagName !== "STYLE") parts.push(t);
  }
  return parts.join(" | ").slice(0, 2000);
});
console.log(info);
await browser.close();
