import { test, expect } from "@playwright/test";

test.describe("section navigation", () => {
  test("a nav link on home scrolls to its section and moves focus there", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
    await expect(page.locator("#contact")).toBeFocused();
  });

  test("a deep link lands the section heading below the fixed header", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeInViewport();
    const header = await page.locator("header").first().boundingBox();
    const heading = await page.locator("#contact h2").first().boundingBox();
    expect(header).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  });
});

test.describe("mobile menu @mobile", () => {
  test("opens as a modal, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Work" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("the page still scrolls after the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.keyboard.press("Escape");
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("a menu link closes the menu and reaches the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
