import { test, expect, type Page } from "@playwright/test";

// Automated browsers skip the intro (navigator.webdriver), so every other spec
// sees the page as a returning visitor would. These tests opt back in.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }));
});

const layer = (page: Page) => page.locator("[data-intro]");
const playing = (page: Page) => page.evaluate(() => document.documentElement.classList.contains("intro"));

test.describe("first-visit intro", () => {
  test("plays on the first view of a session, then never again in it", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(await playing(page)).toBe(true);
    await expect(layer(page)).toBeVisible();
    await expect(layer(page)).toBeHidden({ timeout: 2_000 });
    await page.goto("/work/pawguard", { waitUntil: "domcontentloaded" });
    expect(await playing(page)).toBe(false);
    await expect(layer(page)).toBeHidden();
  });

  test("is hidden from assistive tech and holds no focusable content", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(layer(page)).toHaveAttribute("aria-hidden", "true");
    await expect(layer(page).locator("a, button, [tabindex]")).toHaveCount(0);
  });

  test("the wordmark lands exactly on the header logo", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Freeze every intro animation at its end, then compare boxes.
    const [mark, logo] = await page.evaluate(() => {
      for (const a of document.getAnimations()) {
        const target = (a.effect as KeyframeEffect | null)?.target;
        if (target instanceof Element && target.closest("[data-intro]")) {
          a.pause();
          a.currentTime = (a.effect!.getComputedTiming().endTime as number) - 1;
        }
      }
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height];
      };
      return [box(document.querySelector("[data-intro-mark]")!), box(document.querySelector("[data-wordmark]")!)];
    });
    mark.forEach((v, i) => expect(Math.abs(v - logo[i]), `mark ${mark} vs logo ${logo}`).toBeLessThan(1.5));
  });

  test("lands within 1.6s, then the header wordmark and the headline are in place", async ({ page }) => {
    await page.goto("/");
    await expect(layer(page)).toBeHidden({ timeout: 1_600 });
    expect(await playing(page)).toBe(false);
    await expect(page.locator("[data-wordmark]")).toHaveCSS("opacity", "1");
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("h1 .word-rise")].filter(
          (w) => w.getBoundingClientRect().top >= w.parentElement!.getBoundingClientRect().bottom - 1,
        ).length,
    );
    expect(hidden).toBe(0);
  });

  for (const how of ["click", "key"] as const) {
    test(`a ${how} skips it`, async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(layer(page)).toBeVisible();
      if (how === "click") await page.mouse.click(10, 400);
      else await page.keyboard.press("Shift");
      await expect(layer(page)).toBeHidden({ timeout: 400 });
      await expect(page.locator("[data-wordmark]")).toHaveCSS("opacity", "1");
    });
  }
});

test.describe("intro under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("never plays", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(await playing(page)).toBe(false);
    await expect(layer(page)).toBeHidden();
  });
});

test.describe("intro without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("never plays", async ({ page }) => {
    await page.goto("/");
    await expect(layer(page)).toBeHidden();
  });
});
