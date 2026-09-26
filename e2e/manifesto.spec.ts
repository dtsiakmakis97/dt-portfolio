import { test, expect } from "@playwright/test";
import { manifesto, manifestoAccent } from "../lib/content";

const INK = "rgb(242, 240, 234)";
const BLUE = "rgb(59, 157, 255)";

test.describe("manifesto", () => {
  test("the statement keeps its accessible name after splitting", async ({ page }) => {
    await page.goto("/");
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(page.locator("#about h2")).toHaveAccessibleName(manifesto);
  });

  test("words fill to ink, and the closing clause to blue, once scrolled through", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    const color = (locator: ReturnType<typeof page.locator>) =>
      locator.evaluate((el) => getComputedStyle(el).color);
    await expect.poll(() => color(page.locator("#about h2 > div").first())).toBe(INK);
    await expect.poll(() => color(page.locator("#about h2 .text-blue div").last())).toBe(BLUE);
  });

  test("resizing after the split neither duplicates nor drops words", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 390, height: 844 });
    const h2 = page.locator("#about h2");
    await expect(h2).toHaveAccessibleName(manifesto);
    const text = await h2.evaluate((el) => el.textContent?.replace(/\s+/g, " ").trim());
    expect(text).toBe(manifesto);
  });
});

test.describe("manifesto under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("renders fully inked and unsplit", async ({ page }) => {
    await page.goto("/");
    const h2 = page.locator("#about h2");
    await expect(h2).toHaveCSS("color", INK);
    await expect(h2.locator(".text-blue")).toHaveText(manifestoAccent);
    await expect(h2.locator(".text-blue")).toHaveCSS("color", BLUE);
    await expect(h2.locator("div")).toHaveCount(0);
  });
});

test.describe("about layout", () => {
  test("the work index starts within two screens on a 1440x900 display", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const top = await page.evaluate(() => document.getElementById("work")!.getBoundingClientRect().top + window.scrollY);
    expect(top).toBeLessThanOrEqual(2 * 900);
  });
});
