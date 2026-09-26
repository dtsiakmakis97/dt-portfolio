import type { Page } from "@playwright/test";

/** GSAP loads after the page's load event (lib/motion/load.ts). Tests that
 *  assert GSAP-driven state wait for it before scrolling to their target, or
 *  the "already reached" guard will, correctly, skip the entrance. */
export async function waitForMotion(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.dataset.motion === "ready");
}
