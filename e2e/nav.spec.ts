import { test, expect, type Page } from "@playwright/test";

test.describe("section navigation", () => {
  test("a nav link on home scrolls to its section and moves focus there", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
    await expect(page.locator("#contact")).toBeFocused();
  });

  test("a deep link lands the section heading below the fixed header", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeInViewport();
    const header = await page.locator("header").first().boundingBox();
    const heading = await page.locator("#contact h2").first().boundingBox();
    expect(header).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  });
});

test.describe("mobile menu @mobile", () => {
  test("opens as a modal, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Work" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("the page still scrolls after the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.keyboard.press("Escape");
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("a menu link closes the menu and reaches the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

test.describe("header state", () => {
  test("no section is marked current at the top of the home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("navigation", { name: "Primary" }).locator('[aria-current="true"]')).toHaveCount(0);
  });

  test("the header turns solid, without blur, once scrolled", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 600);
    const header = page.locator("header").first();
    await expect(header).toHaveCSS("background-color", "rgb(11, 11, 12)");
    await expect(header).toHaveCSS("backdrop-filter", "none");
  });
});

test.describe("header on a phone @mobile", () => {
  test("shows only the logo and the menu button", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: "Email" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  });
});

test.describe("collapsed header and full-screen menu", () => {
  const menuButton = (page: Page) => page.locator("header").getByRole("button", { name: "Menu" });
  const menu = (page: Page) => page.getByRole("dialog", { name: "Menu" });
  const pastHero = async (page: Page) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 1400);
    await expect(menuButton(page)).toBeVisible();
  };

  test("at the top of the page the inline nav is all there is: no Menu pill on desktop", async ({ page }) => {
    await page.goto("/");
    await expect(menuButton(page)).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link")).toHaveCount(5);
  });

  test("past the hero the inline links fold away into a Menu pill", async ({ page }) => {
    await pastHero(page);
    await expect(page.getByRole("navigation", { name: "Primary" })).toHaveAttribute("inert", "");
    await expect(page.locator("header").getByRole("link", { name: "Email" })).toBeHidden();
  });

  test("the collapsed header names the section in view", async ({ page }) => {
    await page.goto("/#experience");
    await expect(page.locator("[data-current-section]")).toHaveText("Experience");
  });

  test("the Menu opens a full-screen menu of every section; a row closes it and lands there", async ({ page }) => {
    await pastHero(page);
    await menuButton(page).click();
    await expect(menu(page)).toBeVisible();
    await expect(menu(page).getByRole("navigation", { name: "Sections" }).getByRole("link")).toHaveCount(5);
    await menu(page).getByRole("link", { name: "Contact", exact: true }).click();
    await expect(menu(page)).toBeHidden();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("hovering a row floods it blue with its facts, and the link keeps its name", async ({ page }) => {
    await pastHero(page);
    await menuButton(page).click();
    const work = menu(page).getByRole("link", { name: "Work", exact: true });
    const band = work.locator("[data-band]");
    const track = band.locator("[data-track]");
    await expect(band).toHaveCSS("clip-path", "inset(50% 0px)");
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await work.hover();
    await expect(band).toHaveCSS("clip-path", "inset(0px)");
    await expect(band).toHaveCSS("background-color", "rgb(59, 157, 255)");
    await expect(track).toHaveCSS("animation-play-state", "running");
    await expect(band).toContainText("PawGuard");
  });

  test("keyboard focus shows the band too", async ({ page }) => {
    await pastHero(page);
    await menuButton(page).focus();
    await page.keyboard.press("Enter");
    const stack = menu(page).getByRole("link", { name: "Stack", exact: true });
    await stack.focus();
    await expect(stack.locator("[data-band]")).toHaveCSS("clip-path", "inset(0px)");
  });

  test("Escape closes it and hands focus back to the Menu pill", async ({ page }) => {
    await pastHero(page);
    await menuButton(page).click();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
  });
});

test.describe("menu under reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the band never scrolls", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 1400);
    await page.locator("header").getByRole("button", { name: "Menu" }).click();
    const work = page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Work", exact: true });
    await work.hover();
    await expect(work.locator("[data-track]")).toHaveCSS("animation-name", "none");
  });
});
