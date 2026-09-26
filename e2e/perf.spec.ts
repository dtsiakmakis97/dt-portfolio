import { test, expect } from "@playwright/test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

/** Budgets from docs/redesign/SPEC.md "Verification": JS on / at most ~60KB
 *  gzipped over the pre-redesign baseline, and CLS ≤ 0.05. Measured on a
 *  production build in the mobile project, so desktop-only lazy chunks
 *  (the old WebGL hero) never count. Record the baseline once with
 *  RECORD_BASELINE=1 before any redesign code lands. Re-recording rewrites
 *  the file, so re-run the Lighthouse merge after it. */
const BASELINE_FILE = "docs/redesign/baseline.json";
const JS_BUDGET_OVER_BASELINE = 60 * 1024;
const CLS_BUDGET = 0.05;

interface Baseline {
  jsBytes: number;
  cls: number;
  measuredAt: string;
  commit: string;
  lighthouse?: unknown;
}

declare global {
  interface Window {
    __cls: number;
  }
}

test.describe("performance budget @mobile", () => {
  test.skip(!process.env.E2E_PROD, "budgets need a production build: E2E_PROD=1");

  test("home JS weight and layout shift", async ({ page }) => {
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) window.__cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    const scriptSizes: Promise<number>[] = [];
    page.on("requestfinished", (request) => {
      if (request.resourceType() === "script") {
        scriptSizes.push(request.sizes().then((s) => s.responseBodySize));
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });
    const jsBytes = (await Promise.all(scriptSizes)).reduce((sum, n) => sum + n, 0);
    const cls = await page.evaluate(() => window.__cls);
    test.info().annotations.push(
      { type: "jsBytes", description: String(jsBytes) },
      { type: "cls", description: cls.toFixed(4) },
    );

    if (process.env.RECORD_BASELINE) {
      const commit = execSync("git rev-parse --short HEAD").toString().trim();
      const baseline: Baseline = { jsBytes, cls, measuredAt: new Date().toISOString(), commit };
      writeFileSync(BASELINE_FILE, `${JSON.stringify(baseline, null, 2)}\n`);
      return;
    }

    expect(existsSync(BASELINE_FILE), "record a baseline first: RECORD_BASELINE=1").toBe(true);
    const baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8")) as Baseline;
    expect(jsBytes, `JS on / (baseline ${baseline.jsBytes})`).toBeLessThanOrEqual(
      baseline.jsBytes + JS_BUDGET_OVER_BASELINE,
    );
    expect(cls, "CLS on /").toBeLessThanOrEqual(CLS_BUDGET);
  });
});
