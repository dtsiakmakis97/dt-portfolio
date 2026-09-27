import { test, expect, type Page } from "@playwright/test";
import { waitForMotion } from "./helpers/motion";
import { peakLuminance, sampleColor, type Clip } from "./helpers/pixels";
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

  test("the lens field holds one still frame, ignores the pointer and offers no pause control", async ({ page }) => {
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await expect(frameChanges(page, { sweep: true })).resolves.toBe(false);
    await expect(page.getByRole("button", { name: /motion/i })).toHaveCount(0);
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

  test("the lens field drifts on touch too, with its pause control", async ({ page }) => {
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await expect(page.getByRole("button", { name: "Pause motion" })).toBeVisible();
  });
});

const FIELD = { timeout: 10_000 };
const field = (page: Page) => page.locator("canvas[data-hero-field]");

/** Whether the field's pixels change over 400ms, with everything else hidden.
 *  With `sweep`, the pointer also crosses the hero in that window. */
async function frameChanges(page: Page, { sweep = false } = {}): Promise<boolean> {
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
  await hideAllButField(page);
  const before = await field(page).screenshot();
  if (sweep) {
    const box = (await page.locator("#top").boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.6, { steps: 12 });
  }
  await page.waitForTimeout(400);
  return !before.equals(await field(page).screenshot());
}

interface TextOnField {
  readonly text: string;
  readonly clip: Clip;
  /** Luminance of the dimmest color the text takes: at rest, or hovered. */
  readonly luminance: number;
}

/** WCAG relative luminance of a computed "rgb(r, g, b)". */
function luminanceOf(css: string): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = css.match(/[\d.]+/g)!.map(Number);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Every piece of text in the hero and the header over it that sits straight
 *  on the field (no opaque background of its own), as it stands at scroll 0,
 *  with the dimmest color it takes: each link and button is really hovered,
 *  with transitions off so the hover color is the final one. */
async function textOnField(page: Page): Promise<TextOnField[]> {
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
  const found = await page.evaluate(() => {
    const opaque = (el: Element) => !/^(transparent|rgba\(.*,\s*0\))$/.test(getComputedStyle(el).backgroundColor);
    const roots = [document.getElementById("top")!, document.querySelector("header")!];
    let probe = 0;
    return roots.flatMap((root) =>
      [...root.querySelectorAll("*")].flatMap((el) => {
        const text = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent!.trim())
          .join(" ")
          .trim();
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (!text || r.width < 2 || r.height < 2 || style.visibility === "hidden" || r.top >= innerHeight || r.bottom <= 0) return [];
        for (let at: Element | null = el; at && at !== root.parentElement; at = at.parentElement) if (opaque(at)) return [];
        el.setAttribute("data-probe", String(probe++));
        const top = Math.max(0, r.top);
        const left = Math.max(0, r.left);
        return [
          {
            text,
            clip: { x: left, y: top, width: Math.min(r.right, innerWidth) - left, height: Math.min(r.bottom, innerHeight) - top },
            colors: [el instanceof SVGElement ? style.fill : style.color],
          },
        ];
      }),
    );
  });
  // Keyed by the probe index: document order puts the header first.
  const colorsNow = () =>
    page.locator("[data-probe]").evaluateAll((els) =>
      els.map((el) => [Number(el.getAttribute("data-probe")), getComputedStyle(el)[el instanceof SVGElement ? "fill" : "color"]] as const),
    );
  for (const control of await page.locator("#top :is(a, button), header :is(a, button)").all()) {
    if (!(await control.isVisible())) continue;
    await control.hover();
    for (const [i, color] of await colorsNow()) found[i].colors.push(color);
  }
  return found.map(({ text, clip, colors }) => ({ text, clip, luminance: Math.min(...colors.map(luminanceOf)) }));
}

/** Hides everything over the field (hero content, header, the dev indicator)
 *  without moving it, so the shelter stays where it was measured. */
async function hideAllButField(page: Page): Promise<void> {
  await page.addStyleTag({
    // visibility, not display: the field may re-measure its shelter at any time,
    // and a header with no box would drop out of it.
    content: "nextjs-portal { display: none !important; } header, header *, #top > :not(canvas), #top [data-shelter] { visibility: hidden !important; }",
  });
}

test.describe("hero lens field", () => {
  test("fades in after load, hidden from assistive tech, blue, and drifting", async ({ page }) => {
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await expect(field(page)).toHaveAttribute("aria-hidden", "true");
    await expect(frameChanges(page)).resolves.toBe(true);
    // Its light gathers to the right: on average that half reads blue.
    const box = (await page.locator("#top").boundingBox())!;
    const [r, g, b] = await sampleColor(page, { x: box.width / 2, y: 0, width: box.width / 2, height: box.height * 0.7 });
    expect(b).toBeGreaterThan(g);
    expect(b - r).toBeGreaterThan(20);
  });

  test("Pause motion freezes the field, and the choice survives a reload", async ({ page }) => {
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await page.getByRole("button", { name: "Pause motion" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Play motion" })).toBeFocused();
    await expect(frameChanges(page, { sweep: true })).resolves.toBe(false);
    await page.reload();
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await expect(page.getByRole("button", { name: "Play motion" })).toBeVisible();
    await expect(frameChanges(page, { sweep: true })).resolves.toBe(false);
  });

  test("every word over the field keeps 4.5:1 against the brightest pixel behind it", async ({ page }) => {
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await page.getByRole("button", { name: "Pause motion" }).click();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    const texts = await textOnField(page);
    // The kicker, each headline word, the subhead, the ghost pill, the badge ring,
    // the pause control and the header's links.
    expect(texts.length).toBeGreaterThanOrEqual(10);
    await hideAllButField(page);
    for (const { text, clip, luminance } of texts) {
      const behind = await peakLuminance(page, clip);
      expect((luminance + 0.05) / (behind + 0.05), `${text} ${JSON.stringify(clip)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("on a renderer too slow to keep up, the field settles and drops its control", async ({ page }) => {
    // Every frame costs 60ms: the field's frame governor should give up on motion.
    await page.addInitScript(() => {
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) =>
        raf((time) => {
          const until = performance.now() + 60;
          while (performance.now() < until);
          callback(time);
        });
    });
    await page.goto("/");
    await expect(field(page)).toHaveCSS("opacity", "1", FIELD);
    await expect(page.getByRole("button", { name: /motion/i })).toHaveCount(0, { timeout: 15_000 });
    await expect(frameChanges(page, { sweep: true })).resolves.toBe(false);
  });

  test("without WebGL the hero is exactly as before", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        return /webgl/.test(type) ? null : (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof original;
    });
    await page.goto("/");
    await waitForMotion(page);
    await page.waitForTimeout(500);
    await expect(field(page)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /motion/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
