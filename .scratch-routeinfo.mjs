import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

await page.evaluate(() => {
  const shadow = document.querySelector("nextjs-portal").shadowRoot;
  shadow.querySelector('button[aria-label="Open Next.js Dev Tools"]').click();
});
await page.waitForTimeout(500);

await page.evaluate(() => {
  const shadow = document.querySelector("nextjs-portal").shadowRoot;
  const items = Array.from(shadow.querySelectorAll("*"));
  const routeInfo = items.find(el => el.textContent.trim() === "Route Info" && el.children.length === 0);
  (routeInfo?.closest("[role='menuitem'], li, div") ?? routeInfo)?.click();
});
await page.waitForTimeout(500);
await page.screenshot({ path: "07-route-info.png" });
await browser.close();
