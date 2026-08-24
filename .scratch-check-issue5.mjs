import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  if (!el) return "NO PORTAL ELEMENT";
  const shadow = el.shadowRoot;
  if (!shadow) return "NO SHADOW ROOT";
  const buttons = Array.from(shadow.querySelectorAll("button"));
  return buttons.map(b => JSON.stringify({aria: b.getAttribute("aria-label"), text: b.textContent.trim().slice(0,80)})).join("\n");
});
console.log("RESULT:", info);
await browser.close();
