import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../lib/content";
import { waitForMotion } from "./helpers/motion";

/** WCAG 2.2 AA on every route, checked in the final visual state (reduced
 *  motion: no mid-animation colors, the scroll-fill statement fully inked),
 *  then once more on home after the motion itself has run. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES = ["/", ...projects.map((p) => `/work/${p.slug}`), "/work/does-not-exist"];

test.describe("accessibility", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  for (const path of PAGES) {
    test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  }
});

test.describe("accessibility after the motion has run", () => {
  test("/ has no WCAG 2.2 AA violations once scrolled through", async ({ page }) => {
    await page.goto("/");
    await waitForMotion(page);
    for (let y = 0; y < 14000; y += 500) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(1500);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
});
