import { test, expect } from "@playwright/test";
import { projects } from "../lib/content";
import { PROJECT_SLUGS } from "../lib/work/types";
import { getNextProject } from "../lib/work";

test("projects follow PROJECT_SLUGS, and Next wraps from the last to the first", () => {
  expect(projects.map((p) => p.slug)).toEqual([...PROJECT_SLUGS]);
  expect(getNextProject("pawguard").slug).toBe("lead-finder");
  expect(getNextProject("kryora").slug).toBe("pawguard");
});

for (const project of projects) {
  test(`/work/${project.slug} renders with its own title, canonical and social tags`, async ({ page }) => {
    const response = await page.goto(`/work/${project.slug}`);
    expect(response?.status()).toBe(200);
    const title = `${project.name} · Dimitrios Tsiakmakis`;
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/work/${project.slug}$`));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", new RegExp(`/work/${project.slug}$`));
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", project.summary);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(project.noindex ? 1 : 0);
  });
}

test("Kryora stays out of search", async ({ page }) => {
  await page.goto("/work/kryora");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

test("an unknown slug is a 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
});

test.describe("case study without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the page renders from the server", async ({ page }) => {
    await page.goto("/work/pawguard");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("PawGuard");
  });
});
