import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Next.js dev overlay lives inside a custom element with shadow DOM
const info = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  if (!el) return "no nextjs-portal element";
  const shadow = el.shadowRoot;
  if (!shadow) return "no shadow root";
  const issueEl = shadow.querySelector('[data-nextjs-dev-tools-button], [aria-label*="issue" i], [aria-label*="Issue" i]');
  return shadow.body ? shadow.body.innerText.slice(0, 3000) : shadow.innerHTML.slice(0, 5000);
});
console.log(info);

await browser.close();
