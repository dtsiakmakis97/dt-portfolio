import { test, expect, type Page } from "@playwright/test";
import { waitForMotion } from "./helpers/motion";

interface Seen {
  pseudo: string;
  name: string;
  duration: number;
}

/** Records every ::view-transition-* animation while `action` runs. The window
 *  of `ms` starts when the navigation lands (URL change or first transition
 *  frame), not at the click: a cold dev route can take seconds to compile.
 *  Client-side navigations keep the document, so the recorder survives. */
async function recordTransition(page: Page, action: () => Promise<unknown>, ms = 2500): Promise<Seen[]> {
  const recording = page.evaluate(
    (windowMs) =>
      new Promise<Seen[]>((resolve) => {
        const seen = new Map<string, Seen>();
        const startUrl = location.href;
        const hardStop = performance.now() + 15000;
        let landedAt: number | null = null;
        const tick = () => {
          for (const animation of document.getAnimations()) {
            const pseudo = (animation.effect as KeyframeEffect | null)?.pseudoElement ?? "";
            if (!pseudo.startsWith("::view-transition")) continue;
            const name = (animation as CSSAnimation).animationName ?? "";
            const duration = Number(animation.effect?.getComputedTiming().duration ?? 0);
            seen.set(`${pseudo}|${name}`, { pseudo, name, duration });
          }
          if (landedAt === null && (seen.size > 0 || location.href !== startUrl)) landedAt = performance.now();
          const done = landedAt !== null ? performance.now() > landedAt + windowMs : performance.now() > hardStop;
          if (done) resolve([...seen.values()]);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );
  await action();
  return recording;
}

function trackDuplicateNames(page: Page): string[] {
  const duplicates: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /two <ViewTransition/.test(message.text())) duplicates.push(message.text());
  });
  return duplicates;
}

test.describe("page transitions", () => {
  test("a work row opens its case study under the forward curtain, and the title morphs", async ({ page }) => {
    const duplicates = trackDuplicateNames(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForMotion(page);
    const row = page.locator('#work a[data-slug="pawguard"]');
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    const seen = await recordTransition(page, () => row.click());
    await expect(page).toHaveURL("/work/pawguard");
    // The curtain rides the pages' own boundaries: the old page lifts, the new one reveals.
    expect(seen.some((s) => s.pseudo.startsWith("::view-transition-old(") && s.name === "vt-curtain-lift")).toBe(true);
    expect(seen.some((s) => s.pseudo.startsWith("::view-transition-new(") && s.name === "vt-curtain-reveal")).toBe(true);
    expect(seen.some((s) => s.pseudo === "::view-transition-group(project-title-pawguard)")).toBe(true);
    expect(seen.some((s) => s.pseudo === "::view-transition-group(project-media-pawguard)")).toBe(true);
    expect(duplicates).toEqual([]);
  });

  test("Next runs the curtain without morphing any title", async ({ page }) => {
    await page.goto("/work/pawguard");
    await waitForMotion(page);
    const seen = await recordTransition(page, () => page.getByRole("link", { name: "Next Lead Finder" }).click());
    await expect(page).toHaveURL("/work/lead-finder");
    expect(seen.map((s) => s.name)).toContain("vt-curtain-lift");
    expect(seen.some((s) => s.pseudo.startsWith("::view-transition-group(project-"))).toBe(false);
  });

  test("Back returns home instantly, leaves nothing running, and Lenis follows", async ({ page }) => {
    await page.goto("/");
    await waitForMotion(page);
    const row = page.locator('#work a[data-slug="pawguard"]');
    await row.scrollIntoViewIfNeeded();
    await row.click();
    await expect(page).toHaveURL("/work/pawguard");
    const seen = await recordTransition(page, () => page.goBack(), 1500);
    await expect(page).toHaveURL("/");
    // Untyped: no curtain and no morph (SHARE_ON_NAV defaults to "none").
    expect(seen.filter((s) => s.duration > 0)).toEqual([]);
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => ((a.effect as KeyframeEffect | null)?.pseudoElement ?? "").startsWith("::view-transition")).length,
    );
    expect(running).toBe(0);
    // The browser restores the scroll position it left; Lenis must follow, not snap to the top.
    const restored = await page.evaluate(() => window.scrollY);
    expect(restored).toBeGreaterThan(0);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(restored + 200);
  });

  test("a header section link from a case study lands on the home section below the header", async ({ page }) => {
    await page.goto("/work/pawguard");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/#contact");
    const contact = page.locator("#contact");
    await expect(contact).toBeInViewport();
    expect(await contact.evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(56);
  });
});

test.describe("page transitions @mobile", () => {
  test("tapping a row morphs the title with no preview and no duplicate names", async ({ page }) => {
    const duplicates = trackDuplicateNames(page);
    await page.goto("/");
    await waitForMotion(page);
    const row = page.locator('#work a[data-slug="aegeon"]');
    await row.scrollIntoViewIfNeeded();
    const seen = await recordTransition(page, () => row.tap());
    await expect(page).toHaveURL("/work/aegeon");
    expect(seen.some((s) => s.pseudo === "::view-transition-group(project-title-aegeon)")).toBe(true);
    expect(seen.some((s) => s.pseudo.includes("project-media-"))).toBe(false);
    expect(duplicates).toEqual([]);
  });
});

test.describe("page transitions under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("navigation still works and no transition animation takes time", async ({ page }) => {
    await page.goto("/");
    await waitForMotion(page); // hydrated, so the click is a client-side (transitioned) navigation
    const row = page.locator('#work a[data-slug="aegeon"]');
    await row.scrollIntoViewIfNeeded();
    const seen = await recordTransition(page, () => row.click(), 1000);
    await expect(page).toHaveURL("/work/aegeon");
    expect(seen.filter((s) => s.duration > 0)).toEqual([]);
  });
});
