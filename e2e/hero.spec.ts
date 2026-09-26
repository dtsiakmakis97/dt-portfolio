import { test, expect } from "@playwright/test";
import { hero, facts } from "../lib/content";

test.describe("hero", () => {
  test("the headline is real text, named by its content, with the accent in blue", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(hero.headline);
    await expect(h1).toHaveAccessibleName(hero.headline);
    await expect(h1).not.toHaveAttribute("aria-label");
    await expect(h1.locator(".text-blue")).toHaveText(hero.accent);
    await expect(h1.locator(".text-blue")).toHaveCSS("color", "rgb(59, 157, 255)");
  });

  test("the fact strip shows the four facts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("list", { name: "At a glance" }).getByRole("listitem")).toHaveText([...facts]);
  });

  test("the badge takes you to the work section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Selected work", exact: true }).click();
    await expect(page.locator("#work")).toBeInViewport();
  });
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("headline and primary action render from the server", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get in touch" })).toBeVisible();
  });
});

test.describe("hero under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the badge never rotates", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 1200);
    await expect(page.locator("[data-badge] svg:has(textPath)")).toHaveCSS("transform", "none");
  });
});
