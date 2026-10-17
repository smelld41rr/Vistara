import { chromium } from "playwright";
import assert from "node:assert/strict";
import { cloneDefaults } from "../src/shared/settings.ts";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("http://readability.test/", (r) =>
    r.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html style="--gf-blur:13px!important" data-gf-mode="author"><body><header role="banner" style="color:#111">Dark author text</header><nav aria-label="Links" style="color:#fff;background:#000">Light author text</nav></body></html>',
    }),
  );
  await page.goto("http://readability.test/");
  await page.evaluate((settings) => {
    window.settings = settings;
    window.listeners = [];
    window.chrome = {
      storage: {
        local: { get: async () => ({ settings: window.settings }) },
        sync: { get: async () => ({}) },
        onChanged: { addListener: (fn) => window.listeners.push(fn) },
      },
      runtime: { onMessage: { addListener: () => {} } },
    };
  }, cloneDefaults());
  await page.addScriptTag({ path: "dist/content.js" });
  await page.waitForSelector("[data-gf-surface]");
  assert.equal(
    await page.locator("header").getAttribute("data-gf-tone"),
    "light",
  );
  assert.equal(await page.locator("nav").getAttribute("data-gf-tone"), "dark");
  await page.evaluate(() => {
    window.settings.accessibility.highContrast = true;
    window.listeners.forEach((fn) => fn());
  });
  await page.waitForTimeout(150);
  assert.equal(
    await page
      .locator("header")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
    "rgb(242, 246, 255)",
  );
  assert.equal(
    await page
      .locator("nav")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
    "rgb(17, 27, 42)",
  );
  await page.evaluate(() => {
    window.settings.enabled = false;
    window.listeners.forEach((fn) => fn());
  });
  await page.waitForTimeout(150);
  assert.equal(await page.locator("[data-gf-tone]").count(), 0);
  assert.equal(
    await page
      .locator("html")
      .evaluate((e) => e.style.getPropertyValue("--gf-blur")),
    "13px",
  );
  assert.equal(
    await page
      .locator("html")
      .evaluate((e) => e.style.getPropertyPriority("--gf-blur")),
    "important",
  );
  assert.equal(
    await page.locator("html").getAttribute("data-gf-mode"),
    "author",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS adaptive light/dark contrast and exact author-style restoration",
  );
} finally {
  await browser.close();
}
