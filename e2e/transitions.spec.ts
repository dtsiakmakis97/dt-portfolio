import { test, expect, type Page } from "@playwright/test";
import { waitForMotion } from "./helpers/motion";

// These tests time view-transition animations. Under full-suite parallel load
// Chromium can skip a transition (its designed instant swap), which reads as a
// missing animation, so the file runs in order in one worker, URL waits allow
// for a busy machine, and a miss gets one retry (reported as flaky, not hidden).
test.describe.configure({ mode: "default", retries: 1 });
const NAV = { timeout: 15_000 };

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
        const note = (animation: Animation) => {
          const pseudo = (animation.effect as KeyframeEffect | null)?.pseudoElement ?? "";
          if (!pseudo.startsWith("::view-transition")) return;
          const name = (animation as CSSAnimation).animationName ?? "";
          const duration = Number(animation.effect?.getComputedTiming().duration ?? 0);
          seen.set(`${pseudo}|${name}`, { pseudo, name, duration });
        };
        // animationstart is queued even when a busy main thread drops rAF polls,
        // so a short animation can't slip between two polls unseen.
        const onStart = (event: AnimationEvent) => {
          const live = document
            .getAnimations()
            .find((a) => (a.effect as KeyframeEffect | null)?.pseudoElement === event.pseudoElement && (a as CSSAnimation).animationName === event.animationName);
          if (live) note(live);
          else if (event.pseudoElement.startsWith("::view-transition") && !seen.has(`${event.pseudoElement}|${event.animationName}`))
            seen.set(`${event.pseudoElement}|${event.animationName}`, { pseudo: event.pseudoElement, name: event.animationName, duration: Number.NaN });
        };
        document.documentElement.addEventListener("animationstart", onStart);
        const tick = () => {
          for (const animation of document.getAnimations()) note(animation);
          if (landedAt === null && (seen.size > 0 || location.href !== startUrl)) landedAt = performance.now();
          const done = landedAt !== null ? performance.now() > landedAt + windowMs : performance.now() > hardStop;
          if (done) {
            document.documentElement.removeEventListener("animationstart", onStart);
            resolve([...seen.values()]);
          } else requestAnimationFrame(tick);
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
    await expect(page).toHaveURL("/work/pawguard", NAV);
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
    await expect(page).toHaveURL("/work/lead-finder", NAV);
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

  test("Back and Forward land where the browser restores, leave nothing running, and Lenis follows", async ({ page }) => {
    await page.goto("/");
    await waitForMotion(page);
    const row = page.locator('#work a[data-slug="pawguard"]');
    await row.scrollIntoViewIfNeeded();
    const home = await page.evaluate(() => window.scrollY);
    await row.click();
    await expect(page).toHaveURL("/work/pawguard", NAV);
    // Scroll the case study, then press Back while Lenis is still gliding toward the wheel's target.
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
    const caseLeft = await page.evaluate(() => window.scrollY);
    const seen = await recordTransition(page, () => page.goBack(), 1500);
    await expect(page).toHaveURL("/", NAV);
    // Untyped: no curtain and no morph (SHARE_ON_NAV defaults to "none").
    expect(seen.filter((s) => s.duration > 0)).toEqual([]);
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => ((a.effect as KeyframeEffect | null)?.pseudoElement ?? "").startsWith("::view-transition")).length,
    );
    expect(running).toBe(0);
    // The browser restores the position home was left at; the old glide must not carry on over it.
    const restored = await page.evaluate(() => window.scrollY);
    expect(Math.abs(restored - home), `restored ${restored}, left at ${home}`).toBeLessThanOrEqual(2);
    // Lenis follows the restored position: the next wheel moves on from there.
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(restored + 200);
    // Forward while that wheel still glides: the case study comes back near where it was left, and stays.
    await page.goForward();
    await expect(page).toHaveURL("/work/pawguard", NAV);
    await page.waitForTimeout(1500);
    const forward = await page.evaluate(() => window.scrollY);
    expect(Math.abs(forward - caseLeft), `forward ${forward}, left at ${caseLeft}`).toBeLessThan(300);
  });

  test("a header section link from a case study lands on the home section below the header", async ({ page }) => {
    await page.goto("/work/pawguard");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/#contact", NAV);
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
    await expect(page).toHaveURL("/work/aegeon", NAV);
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
    await expect(page).toHaveURL("/work/aegeon", NAV);
    expect(seen.filter((s) => s.duration > 0)).toEqual([]);
  });
});
