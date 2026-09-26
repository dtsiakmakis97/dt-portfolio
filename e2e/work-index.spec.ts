import { test, expect } from "@playwright/test";
import { projects } from "../lib/content";

test.describe("work index", () => {
  test("lists every project in order, each linking to its case study", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("#work").getByRole("link");
    await expect(links).toHaveCount(projects.length);
    for (const [i, project] of projects.entries()) {
      await expect(links.nth(i)).toHaveAttribute("href", `/work/${project.slug}`);
      await expect(links.nth(i)).toContainText(project.name);
    }
  });

  test("the keyboard reaches every row in order", async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").getByRole("link").first().focus();
    for (const project of projects.slice(1)) {
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveAttribute("href", `/work/${project.slug}`);
    }
  });

  test("every title spans its row on a 1440 wide display", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const misfits = await page.locator("#work .fit").evaluateAll((boxes) =>
      boxes.flatMap((box) => {
        const title = box.querySelector(".fit-text")!;
        const range = document.createRange();
        range.selectNodeContents(title);
        const fill = range.getBoundingClientRect().width / box.clientWidth;
        return fill >= 0.96 && fill <= 1 ? [] : [`${title.textContent}: ${fill.toFixed(3)}`];
      }),
    );
    expect(misfits).toEqual([]);
  });

  test("title descenders clear the tagline below them", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const collisions = await page.locator("#work a[data-slug]").evaluateAll((rows) =>
      rows.flatMap((row) => {
        const title = row.querySelector<HTMLElement>(".fit-text")!;
        const tagline = title.closest(".fit")!.nextElementSibling!;
        // A zero-size inline-block sits on the baseline, so its bottom is the baseline.
        const probe = document.createElement("span");
        probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
        title.append(probe);
        const baseline = probe.getBoundingClientRect().bottom;
        probe.remove();
        const ctx = document.createElement("canvas").getContext("2d")!;
        const style = getComputedStyle(title);
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const inkBottom = baseline + ctx.measureText(title.textContent!).actualBoundingBoxDescent;
        const gap = tagline.getBoundingClientRect().top - inkBottom;
        return gap >= 8 ? [] : [`${title.textContent}: ${gap.toFixed(1)}px`];
      }),
    );
    expect(collisions).toEqual([]);
  });

  test("hovering a row shows that project's preview", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("#work").getByRole("link").first();
    await first.scrollIntoViewIfNeeded();
    await first.hover();
    await expect(page.locator("[data-preview] img[data-active]")).toHaveAttribute("src", projects[0].cover!.src);
  });
});

test.describe("work index preview (WCAG 1.4.13)", () => {
  test("Escape dismisses the preview without moving the pointer; the next row brings it back", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator("#work").getByRole("link");
    await rows.first().scrollIntoViewIfNeeded();
    await rows.first().hover();
    const active = page.locator("[data-preview] img[data-active]");
    await expect(active).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(active).toHaveCount(0);
    await rows.nth(1).hover();
    await expect(active).toHaveAttribute("src", projects[1].cover!.src);
  });
});

test.describe("work index without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("rows are plain links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#work").getByRole("link")).toHaveCount(projects.length);
  });
});
