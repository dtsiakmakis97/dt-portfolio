import { test, expect, type Page } from "@playwright/test";
import { projects } from "../lib/content";

/** The Task 13 keyboard walkthrough as a repeatable gate: skip link first,
 *  a visible ring on every stop, and a focus order that follows reading order. */

interface Stop {
  name: string;
  href: string | null;
  ring: string;
}

async function tabStops(page: Page, max = 60): Promise<Stop[]> {
  const stops: Stop[] = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      // Next's dev-only overlay host is focusable in dev and absent in production.
      if (!el || el === document.body || el.tagName === "NEXTJS-PORTAL") return null;
      const cs = getComputedStyle(el);
      return {
        name: (el.getAttribute("aria-label") || el.textContent || el.id).replace(/\s+/g, " ").trim(),
        href: el.getAttribute("href"),
        ring: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
      };
    });
    // Past the last stop focus rests on <body>; stop there (or if focus wraps).
    if (!stop || (stops.length > 0 && stop.name === stops[0].name)) break;
    stops.push(stop);
  }
  return stops;
}

test.describe("keyboard walkthrough", () => {
  test("the skip link comes first and lands on the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText("Skip to content");
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("every stop shows the 2px blue ring, in reading order", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const stops = await tabStops(page);

    for (const stop of stops) expect(stop.ring, stop.name).toBe("solid 2px rgb(59, 157, 255)");

    const names = stops.map((s) => s.name);
    expect(names.slice(0, 11)).toEqual([
      "Skip to content",
      "DT.",
      "About",
      "Work",
      "Experience",
      "Stack",
      "Contact",
      "Email",
      "Get in touch",
      "Résumé (PDF)",
      "Selected work",
    ]);
    // The work rows follow the hero, in the index's own order.
    const rowHrefs = stops.map((s) => s.href).filter((h) => h?.startsWith("/work/"));
    expect(rowHrefs).toEqual(projects.map((p) => `/work/${p.slug}`));
    // Contact's call to action comes before the form, and the form before the footer.
    expect(names.indexOf("Email me")).toBeLessThan(names.indexOf("Send message"));
    expect(names.indexOf("Send message")).toBeLessThan(names.lastIndexOf("Résumé (PDF)"));
  });
});

test.describe("keyboard walkthrough @mobile", () => {
  test("the open menu keeps focus out of the page behind it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      // A modal dialog lets focus pass to the browser's own UI (body here), never to page content.
      const outside = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && el !== document.body && !el.closest("dialog");
      });
      expect(outside, `Tab ${i + 1} left the dialog`).toBe(false);
    }
  });
});
