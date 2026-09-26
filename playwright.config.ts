import { defineConfig, devices } from "@playwright/test";

/** E2E config. Desktop Chrome runs everything except `@mobile` tests; a Pixel
 *  7 project runs only `@mobile` tests (menu dialog, perf budgets).
 *  E2E_PROD=1 serves a production build; required for perf budgets, and
 *  refuses to reuse a running dev server. */
const PROD = !!process.env.E2E_PROD;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@mobile/ },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  webServer: {
    command: PROD ? "pnpm build && pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    timeout: (PROD ? 300 : 120) * 1000,
    reuseExistingServer: !process.env.CI && !PROD,
  },
});
