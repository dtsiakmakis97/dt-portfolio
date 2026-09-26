import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { projects } from "../lib/content";

/** Copy gate: claims the research proved wrong or stale must never return.
 *  Source: docs/redesign/SPEC.md, "Content model and accuracy". FILES covers
 *  lib/work/*.ts. */
const FILES = ["lib/content.ts", ...readdirSync("lib/work").filter((f) => f.endsWith(".ts")).map((f) => `lib/work/${f}`)];
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
  // Fact-sheet contradictions (redesign-case-study-facts.md), corrected in Task 15.
  [/gate[sd]? every merge|merge-blocking/i, "PawGuard: one audit round, applied in-line; the rebuild was never merged"],
  [/Gothenburg’s first/i, "Ego Distillers: the client's own claim, not ours to assert"],
  [/English school/i, "T.E.: the signage says English & IT; say language school"],
  [/bilingual SEO/i, "Kryora: SEO foundations only, and the preview is noindexed"],
  [/now shipping/i, "PawGuard is pre-launch: say building"],
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
    // Inside a word, an apostrophe is always a typographic ’ in copy. Copy lives
    // in string literals; code comments may stay plain ASCII.
    const strings = readFileSync(file, "utf8").match(/"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) ?? [];
    const straight = strings.flatMap((literal) => literal.match(/[A-Za-z]'[A-Za-z]+/g) ?? []);
    expect(straight, file).toEqual([]);
  }
});

test("every summary fits a meta description (160 characters)", () => {
  for (const project of projects) expect(project.summary.length, project.slug).toBeLessThanOrEqual(160);
});

test("Career Ops lists only the dashboard's own stack", () => {
  const careerOps = projects.find((p) => p.slug === "career-ops")!;
  expect(careerOps.stack.filter((item) => /playwright|node\.js|claude code/i.test(item))).toEqual([]);
});

test("Ego Distillers credits the client's design direction", () => {
  expect(projects.find((p) => p.slug === "ego-distillers")!.role).toMatch(/client-set/i);
});
