import type { CaseStudy } from "./types";

/*
 * Career Ops Agent case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §5.
 *
 * Sources: W/projects/career-ops-agent.md; P/Career Ops Agent/{LICENSE, VERSION, web/package.json};
 *   git remote -v; git log.
 *   Re-verified 2026-09-26 against W/projects/career-ops-agent.md (writeback: tmp + rename,
 *   delimiter style kept, schema rejects, optimistic revert; Go TUI failed in the no-PTY shell;
 *   career.go parser ported 1:1; stale servers behind the silent move to 3001) and
 *   web/package.json (Next 16.2.6, React 19.2.4, Tailwind v4, Base UI, Recharts, zod), plus
 *   web/lib/metrics.ts (a verbatim port of the upstream metrics).
 *
 * Must not say: credit upstream as santifer/career-ops only (not the LICENSE holder's full name);
 *   Playwright / Node.js / Claude Code agents as the dashboard's stack; customization details
 *   (archetypes, CV, target companies, pipeline counts): keep to "customized fork"; compensation;
 *   bootcamp/funding voucher; gitignored planning doc.
 *   No figures: any capture would show job-search data.
 *
 * Word budget: 300-450.
 */
export const careerOps: CaseStudy = {
  lead: "Career Ops is my customized fork of santifer/career-ops, an MIT-licensed AI job-search system, set up for my own move toward AI roles, plus the local dashboard I built over its markdown files.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "The system itself is upstream’s work, not mine: the scripts, the PDF generation, the Go terminal dashboard and the Claude Code skill system all come from santifer/career-ops. I customized the fork for my search in May 2026 and built the web dashboard over two days later that month.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "Upstream ships a Go terminal dashboard, but it wouldn’t launch inside Claude Code’s shell, which has no pseudo-terminal. So I built a web dashboard that reads and writes the same markdown files the agent does.",
      ],
    },
    { kind: "statement", text: "No database. The markdown is the database." },
    {
      kind: "decisions",
      items: [
        {
          summary: "The files are the database",
          body: "The dashboard adds no store of its own. It reads the markdown and TSV files the system already keeps, so the agent and the dashboard never disagree about state.",
        },
        {
          summary: "Every status change rewrites exactly one row",
          body: "Status changes and follow-ups go through Server Actions that replace one row of a table in place, writing a temp file and renaming it over the original. Each line keeps its delimiter style and whitespace, a row that fails validation is rejected, and the optimistic UI reverts if the server refuses.",
        },
        {
          summary: "The parser, ported line for line from Go",
          body: "The data layer is a 1:1 TypeScript port of upstream’s Go parser, from status aliases in English and Spanish to tables that mix pipes and tabs. The metrics are ported verbatim too, so both dashboards count the same way.",
        },
        {
          summary: "A dark theme with one accent, kept to actions",
          body: "Refero references led to a dark theme derived from Linear, with a single lime accent reserved for things you can act on. A light teal look read like a wellness app and two editorial directions felt wrong for a tool, so both were rejected.",
        },
      ],
    },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "A link wrapped around a table row produced invalid HTML and a hydration mismatch. pnpm 10 promoted the dashboard folder to a workspace root and broke the dev server. And Next 16, finding port 3000 taken, quietly moved to 3001 while two stale servers kept serving old code.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "Four views ship: Pipeline, with status writeback and a PDF preview; an Inbox; Follow-ups with full editing; and Progress charts, plus a report viewer. It is a personal tool that runs locally. A fourth version is scoped but not built.",
      ],
    },
  ],
};
