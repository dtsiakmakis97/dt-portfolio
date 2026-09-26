import { test, expect } from "@playwright/test";
import { projects } from "../lib/content";
import { caseStudies } from "../lib/work";
import type { CaseBlock, CaseStudy, ProjectSlug } from "../lib/work/types";

/** Case studies written and signed off. Each Phase 5 task adds its slug first,
 *  which fails until the study exists. */
const WRITTEN: readonly ProjectSlug[] = ["pawguard", "lead-finder"];

/** What the sources can support (redesign-case-study-facts.md). */
const WORD_BUDGET: Record<ProjectSlug, readonly [number, number]> = {
  pawguard: [800, 1000],
  "lead-finder": [800, 1000],
  aegeon: [800, 1000],
  "ego-distillers": [700, 1000],
  kryora: [600, 800],
  "career-ops": [300, 450],
  "te-learning-center": [300, 500],
};

/** Must-not-say, as far as a pattern can catch it. The user's sign-off covers the rest. */
const MUST_NOT_SAY: Record<ProjectSlug, readonly RegExp[]> = {
  pawguard: [/two independent/i, /gate[sd]? every merge|merge-blocking/i, /offender registry/i, /under a minute|60 seconds/i, /\bis live\b|went live|in production/i],
  "lead-finder": [/four (parallel )?(llm )?analy[sz]ers?|4 parallel/i, /\$\s?\d/, /10x cheaper|\d+\s?s(econds)? per search/i],
  aegeon: [/aegeon\.net/i, /commission saved|15.?18\s?%/i, /stone garden/i, /stripe checkout|deposit checkout/i],
  "ego-distillers": [/emergent/i, /53\s?\/\s?100/, /org\.? ?(no|nr|number)\b/i],
  kryora: [/\broi\b|pays? (for )?itself in/i, /exclusiv/i, /vercel\.app/i, /bilingual seo/i, /testimonial/i],
  "career-ops": [/salary|compensation/i],
  "te-learning-center": [/wcag/i, /opening hours/i, /english school/i],
};
const EVERYWHERE: readonly RegExp[] = [/—/, /bootcamp|voucher/i, /impeccable/i, /\b\d+\s?\/\s?(20|40)\b/, /[A-Za-z]'[A-Za-z]/];

function textOf(study: CaseStudy): string {
  const parts: string[] = [study.lead];
  for (const block of study.blocks) {
    if (block.kind === "prose") parts.push(...block.paragraphs);
    if (block.kind === "decisions") parts.push(block.intro ?? "", ...block.items.flatMap((d) => [d.summary, d.body]));
    if (block.kind === "statement") parts.push(block.text);
    if (block.kind === "figure") parts.push(block.figure.alt, block.figure.caption ?? "");
  }
  return parts.join(" ");
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

function structureProblems(study: CaseStudy): string[] {
  const problems: string[] = [];
  const sections = study.blocks.flatMap((b) => (b.kind === "prose" ? [b.label] : b.kind === "decisions" ? ["Approach"] : []));
  if (sections.join(",") !== "Context,Problem,Approach,Challenges,Outcome") problems.push(`sections: ${sections.join(",")}`);
  const decisions = study.blocks.find((b): b is Extract<CaseBlock, { kind: "decisions" }> => b.kind === "decisions");
  if (!decisions || decisions.items.length < 4 || decisions.items.length > 6) problems.push("Approach needs 4–6 decisions");
  for (const d of decisions?.items ?? []) if (d.summary.length > 80) problems.push(`summary over 80: ${d.summary}`);
  const statements = study.blocks.filter((b): b is Extract<CaseBlock, { kind: "statement" }> => b.kind === "statement");
  if (statements.length > 3) problems.push("more than 3 statement bands");
  for (const s of statements) if (s.text.length > 60) problems.push(`statement over 60: ${s.text}`);
  study.blocks.forEach((b, i) => {
    if (b.kind === "statement" && study.blocks[i + 1]?.kind === "statement") problems.push("adjacent statement bands");
  });
  if (study.blocks[0]?.kind === "statement") problems.push("a statement band opens the study");
  if (wordCount(study.lead) > 45) problems.push("lead over 45 words");
  return problems;
}

test("interim studies are exactly the unwritten ones", () => {
  for (const project of projects) {
    expect(caseStudies[project.slug].lead === "", project.slug).toBe(!WRITTEN.includes(project.slug));
  }
});

for (const slug of WRITTEN) {
  test.describe(`${slug} case study`, () => {
    const study = caseStudies[slug];
    const project = projects.find((p) => p.slug === slug)!;

    test("length fits what the sources support", () => {
      const [min, max] = WORD_BUDGET[slug];
      const n = wordCount(textOf(study));
      expect(n, `${n} words`).toBeGreaterThanOrEqual(min);
      expect(n, `${n} words`).toBeLessThanOrEqual(max);
    });

    test("says nothing its sources forbid", () => {
      const text = textOf(study);
      for (const pattern of [...EVERYWHERE, ...MUST_NOT_SAY[slug]]) expect(text, String(pattern)).not.toMatch(pattern);
    });

    test("follows the case-study structure", () => {
      expect(structureProblems(study)).toEqual([]);
    });

    test("credits imagery that is not the owner's", () => {
      test.skip(!project.noindex, "only unapproved client work carries third-party imagery");
      for (const block of study.blocks) if (block.kind === "figure") expect(block.figure.credit, block.figure.src).toBeTruthy();
    });

    test("renders its sections in order, the decisions as a list, the bands as statements", async ({ page }) => {
      await page.goto(`/work/${slug}`);
      await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
        "Context",
        "Problem",
        "Approach",
        "Challenges",
        "Outcome",
      ]);
      const decisions = study.blocks.find((b): b is Extract<CaseBlock, { kind: "decisions" }> => b.kind === "decisions")!;
      await expect(page.locator('section[aria-labelledby="case-approach"] ol > li h3')).toHaveText(decisions.items.map((d) => d.summary));
      await expect(page.locator("[data-statement]")).toHaveCount(study.blocks.filter((b) => b.kind === "statement").length);
    });
  });
}

test.describe("a written case study without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every section and band renders from the server", async ({ page }) => {
    await page.goto(`/work/${WRITTEN[0]}`);
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(5);
    await expect(page.locator("[data-statement]").first()).toBeVisible();
    await expect(page.locator('section[aria-labelledby="case-approach"] ol > li').first()).toBeVisible();
  });
});
