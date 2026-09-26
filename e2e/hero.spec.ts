import { test, expect } from "@playwright/test";
import { waitForMotion } from "./helpers/motion";
import { hero } from "../lib/content";

test.describe("hero", () => {
  test("the headline is real text, named by its content, with the accent in blue", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(hero.headline);
    await expect(h1).toHaveAccessibleName(hero.headline);
    await expect(h1).not.toHaveAttribute("aria-label");
    await expect(h1.locator(".text-blue")).toHaveText(hero.accent);
    await expect(h1.locator(".text-blue")).toHaveCSS("color", "rgb(59, 157, 255)");
  });

  test("the hero carries no fact strip", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#top").getByRole("list")).toHaveCount(0);
  });

  test("the badge takes you to the work section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Selected work", exact: true }).click();
    await expect(page.locator("#work")).toBeInViewport();
  });
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("headline and primary action render from the server", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get in touch" })).toBeVisible();
  });

  // toBeVisible passes at opacity 0 or with a word parked below its clip, so
  // check the settled state: the CSS entrance must finish without any JS.
  test("the CSS entrance settles with every word and action in view", async ({ page }) => {
    await page.goto("/");
    // page.evaluate works with JS off; waitForFunction's rAF polling does not.
    const settled = () =>
      page.evaluate(() => ({
        wordsBelowClip: [...document.querySelectorAll("h1 .word-rise")].filter(
          (w) => w.getBoundingClientRect().top >= w.parentElement!.getBoundingClientRect().bottom - 1,
        ).length,
        fadedOut: [...document.querySelectorAll(".hero-fade")].filter((e) => getComputedStyle(e).opacity !== "1").length,
      }));
    await expect.poll(settled, { timeout: 5000 }).toEqual({ wordsBelowClip: 0, fadedOut: 0 });
  });
});

test.describe("hero under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the badge never rotates", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 1200);
    await expect(page.locator("[data-badge] svg:has(textPath)")).toHaveCSS("transform", "none");
  });
});

test.describe("hero after Checkpoint A", () => {
  test("the kicker names me and says I take roles and projects", async ({ page }) => {
    await page.goto("/");
    const kicker = page.locator("#top").getByText(hero.available);
    await expect(kicker).toBeVisible();
    await expect(kicker).toContainText("Dimitrios Tsiakmakis");
    await expect(kicker).toContainText(/freelance projects/i);
  });

  test("no headline word shows before its rise", async ({ page }) => {
    await page.goto("/");
    const leaked = await page.evaluate(() => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = 0;
      }
      return [...document.querySelectorAll(".word-rise")].map((word) => {
        const clip = word.parentElement!.getBoundingClientRect();
        return Math.max(0, clip.bottom - word.getBoundingClientRect().top);
      });
    });
    expect(Math.max(...leaked)).toBe(0);
  });

  test("the call to action sits above the fold on a 1280x720 laptop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    const box = await page.getByRole("link", { name: "Get in touch" }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(720);
  });

  test("the badge turns through the hero's own scroll", async ({ page }) => {
    await page.goto("/");
    await waitForMotion(page);
    const half = await page.evaluate(() => document.getElementById("top")!.offsetHeight / 2);
    await page.evaluate((y) => window.scrollTo(0, y), half);
    await expect
      .poll(() =>
        page.locator("[data-badge] svg:has(textPath)").evaluate((el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI + 360) % 360;
        }),
      )
      .toBeGreaterThan(120);
  });
});

test.describe("hero on a phone @mobile", () => {
  test("the blue accent never splits across lines", async ({ page }) => {
    await page.goto("/");
    const lines = await page.locator("h1 .text-blue").evaluate((el) => {
      const tops = new Set([...el.querySelectorAll(".word-clip")].map((w) => Math.round(w.getBoundingClientRect().top)));
      return tops.size;
    });
    expect(lines).toBe(1);
  });
});
