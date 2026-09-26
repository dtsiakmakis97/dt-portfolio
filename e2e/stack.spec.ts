import { test, expect } from "@playwright/test";
import { skills, stackMarquee } from "../lib/content";

test.describe("stack band", () => {
  test("every marquee word is a listed skill", () => {
    const listed = skills.flatMap((g) => g.items).join(" | ");
    expect(stackMarquee.filter((word) => !listed.includes(word))).toEqual([]);
  });

  test("the marquee is decorative; the list carries each skill group once", async ({ page }) => {
    await page.goto("/");
    const stack = page.locator("#stack");
    await expect(stack.locator("[data-marquee]")).toHaveAttribute("aria-hidden", "true");
    await expect(stack.getByRole("heading", { level: 3 })).toHaveText(skills.map((g) => g.label));
    for (const group of skills) {
      for (const item of group.items) {
        await expect(stack.getByRole("listitem").filter({ hasText: item }).first()).toBeVisible();
      }
    }
  });

  test("the band is blue with canvas-colored text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#stack")).toHaveCSS("background-color", "rgb(59, 157, 255)");
    await expect(page.locator("#stack h2")).toHaveCSS("color", "rgb(11, 11, 12)");
  });
});

test.describe("stack band under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the marquee does not move", async ({ page }) => {
    await page.goto("/");
    await page.locator("#stack").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-marquee] > div")).toHaveCSS("transform", "none");
  });
});
