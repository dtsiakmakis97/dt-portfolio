import { test, expect } from "@playwright/test";

test.describe("smooth scroll", () => {
  test("Lenis drives scrolling when motion is allowed", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/(^|\s)lenis(\s|$)/);
  });

  test("reduced motion keeps native scrolling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).not.toHaveClass(/(^|\s)lenis(\s|$)/);
  });
});
