import { test, expect } from "@playwright/test";
import { waitForMotion } from "./helpers/motion";
import { experience, experienceStatement } from "../lib/content";

const clients = experience.flatMap((job) => job.highlights.map((h) => h.client));

test.describe("experience", () => {
  test("a statement heading, then one row per client engagement", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#experience");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(experienceStatement);
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(clients);
  });
});

test.describe("experience after a resize", () => {
  // SplitReveal re-splits on resize (autoSplit); the played guard must stop a
  // replay, and the heading must keep its name, its words and a flat mask tree.
  test("the statement survives a re-split from 1440 to 390 wide", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForMotion(page);
    const h2 = page.locator("#experience h2");
    await h2.scrollIntoViewIfNeeded();
    const lines = h2.locator(".split-line");
    await expect(lines).toHaveCount(1); // one line at 1440
    // Let the reveal finish, so any later offset can only come from a replay.
    await expect.poll(() => lines.first().evaluate((l) => getComputedStyle(l).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(lines).toHaveCount(2); // re-split at 390
    // Read at once: the new lines must already sit in their masks, not replay.
    const offsets = await lines.evaluateAll((els) => els.map((l) => new DOMMatrix(getComputedStyle(l).transform).m42));
    for (const y of offsets) expect(Math.abs(y)).toBeLessThan(0.5);
    await expect(h2).toHaveAccessibleName(experienceStatement);
    await expect
      .poll(() => h2.evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim()))
      .toBe(experienceStatement);
    await expect(h2.locator(".split-line-mask .split-line-mask")).toHaveCount(0);
  });
});

test.describe("experience when motion arrives late", () => {
  // Motion loads after the page's load event. If the reader has already
  // scrolled a reveal into view, it must stay put, not vanish and replay.
  test("a statement the reader already reached is left as it is", async ({ page }) => {
    let afterLoad = false;
    page.on("load", () => (afterLoad = true));
    // Hold every script requested after load (the motion chunk) for 1.5s.
    await page.route("**/_next/static/chunks/**", async (route) => {
      if (afterLoad) await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto("/");
    const h2 = page.locator("#experience h2");
    await h2.scrollIntoViewIfNeeded();
    await waitForMotion(page);
    await page.waitForTimeout(400);
    await expect(h2.locator(".split-line")).toHaveCount(0);
    await expect(h2).toHaveText(experienceStatement);
  });
});

test.describe("experience under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the statement is plain, unsplit text", async ({ page }) => {
    await page.goto("/");
    const h2 = page.locator("#experience h2");
    await expect(h2).toHaveText(experienceStatement);
    await expect(h2.locator(".split-line")).toHaveCount(0);
  });
});
