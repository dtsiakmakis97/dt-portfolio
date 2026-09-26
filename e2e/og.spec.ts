import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { projects } from "../lib/content";

test.describe("share cards, sitemap and 404", () => {
  for (const path of ["/", "/work/pawguard", "/work/career-ops"]) {
    test(`${path} has its own Open Graph and Twitter cards, as PNG`, async ({ page, request }) => {
      await page.goto(path);
      for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const url = new URL((await page.locator(selector).first().getAttribute("content"))!);
        if (path !== "/") expect(url.pathname).toContain(path);
        const response = await request.get(url.pathname + url.search);
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toBe("image/png");
      }
      const alt = await page.locator('meta[property="og:image:alt"]').first().getAttribute("content");
      expect(alt).not.toMatch(/—/);
    });
  }

  test("cards never fetch fonts over the network at build", () => {
    for (const file of ["app/opengraph-image.tsx", "lib/og/render.tsx"]) {
      expect(readFileSync(file, "utf8")).not.toMatch(/fonts\.googleapis|fetch\(/);
    }
  });

  test("the sitemap lists home and every indexable case study, never Kryora", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const project of projects) expect(xml.includes(`/work/${project.slug}</loc>`), project.slug).toBe(!project.noindex);
    expect(xml).toMatch(/<loc>[^<]*\/<\/loc>/);
  });

  test("the 404 names itself, lists the work and links home", async ({ page }) => {
    const response = await page.goto("/work/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/not found/i);
    await expect(page).toHaveTitle(/^Not found · /);
    await expect(page.getByRole("main").getByRole("link", { name: "PawGuard" })).toHaveAttribute("href", "/work/pawguard");
    await expect(page.getByRole("link", { name: "Back to the home page" })).toHaveAttribute("href", "/");
  });
});
