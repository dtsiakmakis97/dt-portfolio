import { test, expect } from "@playwright/test";
import { contact, profile } from "../lib/content";

test.describe("contact", () => {
  test("a mega heading and a round mailto call to action", async ({ page }) => {
    await page.goto("/#contact");
    const section = page.locator("#contact");
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(contact.headline);
    const cta = section.getByRole("link", { name: "Email me" });
    await expect(cta).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(cta).toHaveCSS("border-radius", "9999px");
    await expect(cta).toHaveCSS("background-color", "rgb(59, 157, 255)");
  });

  test("the contact copy invites roles and freelance projects, like the hero kicker", () => {
    expect(contact.body).toMatch(/roles/);
    expect(contact.body).toMatch(/freelance projects/);
  });

  test("the contact copy sets typographic apostrophes", () => {
    expect(`${contact.headline} ${contact.body}`).not.toContain("'");
  });

  test("form controls meet the 3:1 non-text contrast bar", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#name")).toHaveCSS("border-color", "rgb(107, 105, 100)");
  });

  test("a focused field shows the focus ring", async ({ page }) => {
    await page.goto("/#contact");
    // Text inputs match :focus-visible on any focus, so programmatic focus is enough.
    await page.locator("#name").focus();
    await expect(page.locator("#name")).toHaveCSS("outline-style", "solid");
  });
});
