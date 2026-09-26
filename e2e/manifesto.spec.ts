import { test, expect } from "@playwright/test";
import { manifesto } from "../lib/content";

const INK = "rgb(242, 240, 234)";

test.describe("manifesto", () => {
  test("the statement keeps its accessible name after splitting", async ({ page }) => {
    await page.goto("/");
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(page.locator("#about h2")).toHaveAccessibleName(manifesto);
  });

  test("words are fully inked once the statement has scrolled through", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.locator("#about h2 div").last().evaluate((el) => getComputedStyle(el).color))
      .toBe(INK);
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
    await expect(h2.locator("div")).toHaveCount(0);
  });
});
