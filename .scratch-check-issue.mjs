import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const badge = page.getByText("1 Issue");
if (await badge.count()) {
  await badge.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "05-issue-detail.png", fullPage: false });
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.slice(0, 3000));
} else {
  console.log("No issue badge found");
}

await browser.close();
