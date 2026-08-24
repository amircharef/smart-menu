import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  const shadow = el.shadowRoot;
  const clone = shadow.cloneNode(true);
  clone.querySelectorAll("style").forEach((s) => s.remove());
  return clone.textContent.replace(/\s+/g, " ").trim().slice(0, 2000);
});
console.log(info);
await browser.close();
