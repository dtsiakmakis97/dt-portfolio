import { test, expect } from "@playwright/test";

// Critical-path smoke tests. Desktop Chrome viewport, so the md: nav is visible.
const NAV_HREFS = ["#about", "#work", "#experience", "#stack", "#contact"];

test.describe("portfolio smoke", () => {
  test("hero headline renders", async ({ page }) => {
    await page.goto("/");
    // The headline is split into per-word spans (margin-right gaps, no literal
    // spaces in textContent), so assert the accessible name via aria-label.
    const h1 = page.getByRole("heading", { level: 1, name: /AI systems inside them/i });
    await expect(h1).toBeVisible();
  });

  test("primary navigation links are present", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const href of NAV_HREFS) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test("contact form flags missing fields on empty submit", async ({ page }) => {
    await page.goto("/#contact");
    // noValidate form → empty submit hits the Server Action, which returns
    // field errors and marks inputs aria-invalid.
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true");
  });
});
