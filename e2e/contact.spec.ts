import { test, expect } from "@playwright/test";
import { contact, profile } from "../lib/content";

test.describe("contact", () => {
  test("a mega heading and a round mailto call to action; the links live in the footer", async ({ page }) => {
    await page.goto("/#contact");
    const section = page.locator("#contact");
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(contact.headline);
    const cta = section.getByRole("link", { name: "Email me" });
    await expect(cta).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(cta).toHaveCSS("border-radius", "9999px");
    await expect(cta).toHaveCSS("background-color", "rgb(59, 157, 255)");
    // The footer right below carries the email and the links, so the section doesn't repeat them.
    await expect(section.locator("dl")).toHaveCount(0);
    await expect(section.getByRole("link", { name: /GitHub|LinkedIn/ })).toHaveCount(0);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", profile.github);
    await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", profile.linkedin);
    await expect(footer.getByRole("link", { name: profile.email })).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(footer.getByText(/^© 2026/)).toHaveText(`© 2026 ${profile.name}`);
    await expect(footer).not.toContainText("WCAG");
    await expect(footer).not.toContainText(profile.location);
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
