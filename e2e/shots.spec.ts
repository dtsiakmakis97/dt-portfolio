import { test, expect, type Page } from "@playwright/test";

/** Review captures for design checkpoints, not assertions:
 *    SHOTS=1 pnpm exec playwright test e2e/shots.spec.ts --project=chromium
 *  Output: test-results/shots (gitignored): stills plus video/*.webm. */
const WIDTHS = [390, 768, 1440] as const;
const PAGES = ["/", "/work/pawguard", "/work/career-ops"] as const;
const DIR = "test-results/shots";

const slug = (path: string) => (path === "/" ? "home" : path.slice(1).replaceAll("/", "-"));

/** Scroll the page once so every `once` reveal has played before a full-page capture. */
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

test.describe("review captures", () => {
  test.skip(!process.env.SHOTS, "set SHOTS=1 to capture review screenshots");

  for (const path of PAGES) {
    for (const width of WIDTHS) {
      const name = `${slug(path)}-${width}`;

      test(`${name} normal`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await settle(page);
        await page.screenshot({ path: `${DIR}/${name}.png`, fullPage: true });
      });

      test(`${name} reduced motion`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        const page = await context.newPage();
        await page.goto(`http://localhost:3000${path}`);
        await page.waitForLoadState("networkidle");
        await page.screenshot({ path: `${DIR}/${name}-reduced.png`, fullPage: true });
        await context.close();
      });

      test(`${name} no JS`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto(`http://localhost:3000${path}`);
        // The hero's CSS entrance still plays with JS off; capture the settled frame.
        await expect
          .poll(() => page.evaluate(() => document.getAnimations().every((a) => a.playState === "finished")))
          .toBe(true);
        await page.screenshot({ path: `${DIR}/${name}-nojs.png`, fullPage: true });
        await context.close();
      });
    }
  }

  test("home load and scroll recording", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: `${DIR}/video`, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForTimeout(2500);
    for (let i = 0; i < 14; i++) {
      await page.mouse.wheel(0, 450);
      await page.waitForTimeout(350);
    }
    await context.close();
  });

  test("transition recordings", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: `${DIR}/video`, size: { width: 1440, height: 900 } } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForFunction(() => document.documentElement.dataset.motion === "ready");
    const row = page.locator('#work a[data-slug="pawguard"]');
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    await page.waitForTimeout(600);
    await row.click(); // home → detail (curtain, title and media morph)
    await page.waitForTimeout(2500);
    await page.mouse.wheel(0, 20000);
    await page.waitForTimeout(1500);
    await page.getByRole("link", { name: "Next Lead Finder" }).click(); // detail → next (curtain only)
    await page.waitForTimeout(2500);
    await page.getByRole("main").getByRole("link", { name: "All work" }).first().click(); // detail → home (nav-back)
    await page.waitForTimeout(2500);
    await page.goBack(); // browser Back (instant)
    await page.waitForTimeout(1500);
    await context.close();
  });
});
