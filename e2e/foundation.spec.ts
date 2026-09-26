import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test.describe("design foundation", () => {
  test("canvas, ink, body font and tokens resolve to the new system", async ({ page }) => {
    await page.goto("/");
    const styles = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const root = getComputedStyle(document.documentElement);
      return {
        bg: body.backgroundColor,
        color: body.color,
        font: body.fontFamily,
        inkDim: root.getPropertyValue("--color-ink-dim").trim(),
        blue: root.getPropertyValue("--color-blue").trim(),
      };
    });
    expect(styles.bg).toBe("rgb(11, 11, 12)");
    expect(styles.color).toBe("rgb(242, 240, 234)");
    expect(styles.font).toMatch(/cabinet/i);
    expect(styles.inkDim).toBe("#6b6964");
    expect(styles.blue).toBe("#3b9dff");
  });

  test("the focus ring shows in its final color the moment focus lands", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // logo, which carries transition-colors
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineColor);
    expect(ring).toBe("rgb(59, 157, 255)");
  });

  test("fonts are self-hosted, so a build never waits on Google Fonts", () => {
    // A build once failed fetching IBM Plex Mono from fonts.googleapis.com.
    expect(readFileSync("app/layout.tsx", "utf8")).not.toMatch(/next\/font\/google/);
  });

  test("the js class lands on <html> so load reveals can opt in", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/(^|\s)js(\s|$)/);
  });

  test("Cabinet loads as one variable face covering 100-900", async ({ page }) => {
    await page.goto("/");
    const faces = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts]
        .filter((face) => face.status === "loaded")
        .map((face) => `${face.family}|${face.weight}`);
    });
    expect(faces.some((f) => /cabinet/i.test(f) && f.endsWith("|100 900"))).toBe(true);
  });
});
