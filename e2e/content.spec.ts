import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

/** Copy gate: claims the research proved wrong or stale must never return.
 *  Source: docs/redesign/SPEC.md, "Content model and accuracy". Phase 4 adds
 *  lib/work/*.ts to FILES. */
const FILES = ["lib/content.ts"];
const FORBIDDEN: readonly (readonly [RegExp, string])[] = [
  [/four parallel/i, "Lead Finder: the placeholder check short-circuits; only visual + content call Gemini"],
  [/Stripe deposit/i, "Aegeon: request-based booking since 2026-07-09; Stripe switched off"],
  [/two independent|independent audits/i, "PawGuard: the audits were its own subagents"],
  [/running in production/i, "PawGuard: the app has not launched"],
  [/WCAG AA throughout/i, "T.E.: WCAG AA was a target, never audited"],
  [/Multi-agent AI, shipped solo/i, "fact reworded per SPEC"],
  [/—/, "house style: no em dashes"],
];

test("content files contain no retracted claims", () => {
  for (const file of FILES) {
    const text = readFileSync(file, "utf8");
    for (const [pattern, why] of FORBIDDEN) {
      expect(text, `${file}: ${why}`).not.toMatch(pattern);
    }
  }
});
