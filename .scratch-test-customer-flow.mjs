import { chromium } from "playwright";
import path from "node:path";

const shotDir = path.resolve(process.cwd());
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: path.join(shotDir, name), fullPage: true });
}

console.log("== nav /t/1 ==");
await page.goto("http://localhost:3000/t/1", { waitUntil: "networkidle" });
await page.waitForSelector("text=Table 1");
await shot("01-menu.png");
console.log("Title:", await page.title());

const firstAddButton = page.getByRole("button", { name: "Ajouter" }).first();
await firstAddButton.click();
await page.waitForTimeout(300);

const secondAddButton = page.getByRole("button", { name: "Ajouter" }).nth(2);
await secondAddButton.click().catch(() => {});
await page.waitForTimeout(300);
await shot("02-items-added.png");

console.log("== open cart ==");
await page.getByText(/article/).first().click();
await page.waitForSelector("text=Votre commande");
await page.fill("textarea", "Sans piment svp, merci !");
await shot("03-cart-open.png");

console.log("== submit order ==");
await page.getByRole("button", { name: "Valider la commande" }).click();
await page.waitForURL(/\/order\//, { timeout: 10000 });
console.log("Redirected to:", page.url());
await page.waitForSelector("text=Ta commande arrive");
await shot("04-order-tracking.png");

console.log("Console errors:", errors.length ? errors : "none");

await browser.close();
console.log("DONE");
