import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** WCAG 2.2 AA, checked in the final visual state (reduced motion: no
 *  mid-animation colors, the scroll-fill statement fully inked). Phase 4 adds
 *  the case-study routes and the 404. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES = ["/"];

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
