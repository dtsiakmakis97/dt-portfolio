import { test, expect } from "@playwright/test";
import { experience, experienceStatement } from "../lib/content";

const clients = experience.flatMap((job) => job.highlights.map((h) => h.client));

test.describe("experience", () => {
  test("a statement heading, then one row per client engagement", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#experience");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(experienceStatement);
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(clients);
  });
});

test.describe("experience under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the statement is plain, unsplit text", async ({ page }) => {
    await page.goto("/");
    const h2 = page.locator("#experience h2");
    await expect(h2).toHaveText(experienceStatement);
    await expect(h2.locator(".split-line")).toHaveCount(0);
  });
});
