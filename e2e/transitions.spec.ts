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

/** Average color of a small screenshot region, decoded in a blank page (no image library). */
async function sampleColor(page: Page, clip: { x: number; y: number; width: number; height: number }): Promise<number[]> {
  const png = (await page.screenshot({ clip })).toString("base64");
  const decoder = await page.context().newPage();
  const rgb = await decoder.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);
    const sum = [0, 0, 0];
    for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
    return sum.map((v) => Math.round(v / (data.length / 4)));
  }, png);
  await decoder.close();
  return rgb;
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

  test("the incoming page reveals on its own canvas, under the header and the morphing title", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForMotion(page);
    const row = page.locator('#work a[data-slug="pawguard"]');
    await row.scrollIntoViewIfNeeded();
    await row.click();
    // Freeze every transition animation near the end of the reveal (0.3s delay + 0.8s).
    await page.waitForFunction(() => {
      const all = document.getAnimations().filter((a) => ((a.effect as KeyframeEffect | null)?.pseudoElement ?? "").startsWith("::view-transition"));
      if (!all.some((a) => (a as CSSAnimation).animationName === "vt-curtain-reveal")) return false;
      for (const a of all) {
        a.pause();
        a.currentTime = 1050;
      }
      return true;
    });
    // The right-hand gutter of the case page: nothing but its background.
    const [r, g, b] = await sampleColor(page, { x: 1400, y: 560, width: 20, height: 20 });
    expect(b, `rgb(${r}, ${g}, ${b})`).toBeLessThan(40);
    // The opaque page must not cover the named groups: the h1 band shows ink, the header its wordmark.
    const [titleInk] = await sampleColor(page, { x: 56, y: 200, width: 1328, height: 120 });
    expect(titleInk, "h1 band brightness").toBeGreaterThan(60);
    const logo = (await page.locator("header a").first().boundingBox())!;
    const [headerInk] = await sampleColor(page, { x: logo.x, y: logo.y, width: logo.width, height: logo.height });
    expect(headerInk, "wordmark brightness").toBeGreaterThan(60);
  });

  test("Next runs the curtain without morphing any title", async ({ page }) => {
    await page.goto("/work/pawguard");
    await waitForMotion(page);
    const seen = await recordTransition(page, () => page.getByRole("link", { name: "Next Lead Finder" }).click());
    await expect(page).toHaveURL("/work/lead-finder");
    expect(seen.map((s) => s.name)).toContain("vt-curtain-lift");
    expect(seen.some((s) => s.pseudo.startsWith("::view-transition-group(project-"))).toBe(false);
  });

  test("the curtain on Next is visibly blue while the old page lifts", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work/pawguard");
    await waitForMotion(page);
    await page.getByRole("link", { name: "Next Lead Finder" }).click();
    await page.waitForFunction(() => {
      const all = document.getAnimations().filter((a) => ((a.effect as KeyframeEffect | null)?.pseudoElement ?? "").startsWith("::view-transition"));
      if (!all.some((a) => (a as CSSAnimation).animationName === "vt-curtain-lift")) return false;
      for (const a of all) {
        a.pause();
        a.currentTime = 250;
      }
      return true;
    });
    const [r, g, b] = await sampleColor(page, { x: 700, y: 600, width: 40, height: 40 });
    expect([r, g, b], "curtain blue").toEqual([59, 157, 255]);
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
