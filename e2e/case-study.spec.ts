import { test, expect } from "@playwright/test";
import { projects } from "../lib/content";
import { getNextProject } from "../lib/work";

const pawguard = projects[0];

test.describe("case-study frame", () => {
  test("crumb, fitted h1, tagline, hero media, meta strip, Next and All work", async ({ page }) => {
    await page.goto(`/work/${pawguard.slug}`);
    await expect(page.getByText(`Case study · ${pawguard.period}`, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pawguard.name);
    await expect(page.getByText(pawguard.tagline, { exact: true })).toBeVisible();
    await expect(page.getByRole("img", { name: pawguard.cover!.alt })).toBeVisible();
    const meta = page.locator("dl[data-meta]");
    await expect(meta.getByRole("term")).toHaveText(["Role", "Year", "Status", "Stack", "Links"]);
    await expect(meta.getByRole("definition").first()).toHaveText(pawguard.role);
    const next = getNextProject(pawguard.slug);
    await expect(page.getByRole("link", { name: `Next ${next.name}` })).toHaveAttribute("href", `/work/${next.slug}`);
    await expect(page.getByRole("main").getByRole("link", { name: "All work" }).first()).toHaveAttribute("href", "/#work");
  });

  test("the h1 is sized exactly like its work-index title, so the morph is a translate", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const rowSize = await page.locator('#work a[data-slug="aegeon"] .fit-text').evaluate((el) => getComputedStyle(el).fontSize);
    await page.goto("/work/aegeon");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("font-size", rowSize);
  });

  test("a project without a cover gets the blue typographic hero, in canvas ink", async ({ page }) => {
    await page.goto("/work/career-ops");
    const note = page.locator("[data-case-hero-note]");
    await expect(note).toHaveCSS("background-color", "rgb(59, 157, 255)");
    await expect(note.locator("p")).toHaveCSS("color", "rgb(11, 11, 12)");
    await expect(page.getByRole("main").locator("img")).toHaveCount(0);
  });

  test("Kryora credits its imagery and links nowhere outside the site", async ({ page }) => {
    await page.goto("/work/kryora");
    await expect(page.getByText("Imagery: kryora.de (AI renders)")).toBeVisible();
    await expect(page.getByRole("main").locator('a[href^="http"]')).toHaveCount(0);
  });

  test("external links say they open a new tab", async ({ page }) => {
    await page.goto(`/work/${pawguard.slug}`);
    const link = page.getByRole("link", { name: /\(opens in a new tab\)/ }).first();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });
});

test.describe("case-study frame from the keyboard", () => {
  test("Enter on the first work row opens its case study", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").getByRole("link").first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/work/pawguard");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("PawGuard");
  });
});

test.describe("case-study frame without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the whole frame renders from the server", async ({ page }) => {
    await page.goto("/work/lead-finder");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lead Finder");
    await expect(page.locator("dl[data-meta]")).toBeVisible();
    await expect(page.getByRole("link", { name: /^Next / })).toBeVisible();
  });
});
