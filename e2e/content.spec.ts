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
  // The SPEC's merge-gate grep, verbatim: every hit must be resolved.
  [/in production/i, "SPEC content gate: say Live, never imply PawGuard is in production"],
  [/Prosecutor/i, "PawGuard: no Prosecutor's Office integration claims (eventual)"],
  [/kryora\.de\//i, "Kryora: credit kryora.de, never link into it"],
  [/oikonomou\.vercel/i, "T.E.: the vercel.app URL is not the school's official domain"],
];

/** Hits the SPEC gate resolved on purpose, removed before matching. */
const ALLOWED: readonly string[] = [
  // T.E.'s "Live" link: the preview the portfolio shows, never called the official site.
  'href: "https://oikonomou.vercel.app"',
];

const withoutAllowed = (text: string) => ALLOWED.reduce((t, ok) => t.split(ok).join(""), text);

test("content files contain no retracted claims", () => {
  for (const file of FILES) {
    const text = withoutAllowed(readFileSync(file, "utf8"));
    for (const [pattern, why] of FORBIDDEN) {
      expect(text, `${file}: ${why}`).not.toMatch(pattern);
    }
  }
});

test("copy sets typographic apostrophes", () => {
  for (const file of FILES) {
    // Inside a word, an apostrophe is always a typographic ’ in copy.
    const straight = readFileSync(file, "utf8").match(/[A-Za-z]'[A-Za-z]+/g) ?? [];
    expect(straight, file).toEqual([]);
  }
});
