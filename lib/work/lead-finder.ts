import type { CaseStudy } from "./types";

/*
 * Lead Finder case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §2.
 *
 * Sources: W/projects/lead-finder.md; S/2026-05-11-lead-finder-frontend-v2-redesign.md;
 *   S/2026-06-10-lead-finder-frontend-v2-completion.md; P/Lead Finder/{package.json,
 *   docs/superpowers/specs/2026-05-09-lead-finder-design.md, lib/analyzer/index.ts}; git log.
 *   Re-verified 2026-09-26 against lib/analyzer/index.ts (placeholder short-circuit; technical,
 *   screenshot and content in parallel; visual after the screenshot; only visual.ts and content.ts
 *   call Gemini) and W/projects/lead-finder.md, plus both session pages, lib/http/safeFetch.ts and
 *   lib/supabase/signScreenshot.ts. Not stated: the Hobby plan 10s cap as the reason for Pro (not in
 *   the wiki page; it says only that the 60s budget requires Pro).
 *
 * Must not say (the fact sheet's list, reworded so e2e/content.spec.ts's gate stays exact):
 *   - the stale analyzer count from the spec, wiki and Career Ops table (the placeholder check
 *     short-circuits; three tasks run in parallel);
 *   - latency or cost figures (seconds per search, cost per search, how much cheaper Gemini is);
 *   - search data, searched place names, the Supabase ref, the Vercel team URL;
 *   - the outreach email as real (Send is a mock);
 *   - the v2 CSS as original design (a ported Claude Design handoff).
 *
 * Word budget: 800-1000.
 */
export const leadFinder: CaseStudy = {
  lead: "Lead Finder is a prospecting tool and small CRM I built for my own web-design outreach. Type a category and a city, and it returns about twenty local businesses, each scored 0 to 100 with a one-line reason. It is deployed and private.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "I look for local businesses with no website, or with one that is clearly underperforming, and offer to fix it. Lead Finder does the first pass: a category and a city go in, and about twenty businesses from Google Places come out, ranked so the strongest leads come first.",
        "It is a personal tool, built solo between May and June 2026 over 100 commits: Next.js 16 and React 19, Supabase for sign-in and data, Gemini 2.5 Flash for the two checks that need a model, and Vitest for the tests.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "Finding businesses was the easy part. Qualifying them the same way every time was not. A score is only useful if it can be explained, re-run and compared, so every lead needed a number, a reason in plain words and a record of how both were reached.",
        "Re-running a search also had to keep what I already knew. Businesses dedupe on Google’s place_id, each re-run appends a new analysis row instead of overwriting the last one, and the outreach status I set on a lead survives every refresh.",
      ],
    },
    { kind: "statement", text: "No website scores +50 before any model is called." },
    {
      kind: "decisions",
      items: [
        {
          summary: "One server action, one 60-second function",
          body: "The whole pipeline runs synchronously inside a single server action: search Google Places, analyze every business, score it, save it, then open the results. There is no queue and no stream. Each check gets 10 seconds, and the fan-out needs a 60-second function budget, which is why it runs on Vercel Pro.",
        },
        {
          summary: "Cheap checks first; a model only when a real site exists",
          body: "A placeholder check runs first and short-circuits: no website, a social-media page, a parked domain, a dead site or an expired certificate is already a lead. Only a real site goes on to three tasks in parallel: PageSpeed for performance, screenshots at mobile and desktop sizes, and a read of the page’s text. The visual check follows the screenshots. Only the visual and content checks call Gemini.",
        },
        {
          summary: "Each check fails alone",
          body: "Every task runs inside a small trap with its own timeout. When one fails, the error is recorded under its name, its signal is left empty and the rest carry on. The score is computed from what did arrive, so a missing signal lowers my confidence in a lead, not the lead’s score.",
        },
        {
          summary: "Gemini in place of Claude Haiku",
          body: "The first build called Claude Haiku 4.5 for both model reads. I moved them to Gemini 2.5 Flash on cost, since Gemini billing was already set up. The visual read rates modernity and brand quality from the two screenshots; the content read checks the page text against a checklist for the business’s category.",
        },
        {
          summary: "A score you can read: weighted signals and a reason in words",
          body: "No website starts a lead at +50; a parked, social-only, dead or expired site at +40. Slow mobile performance, a dated design and missing content each add weight from there, and the total is capped at 100. The reason string names the worst one or two signals, such as a site that is only a social-media page.",
        },
        {
          summary: "v2: a ported Claude Design system, live progress, optimistic status",
          body: "For the second version I ported a Claude Design handoff: its 1,066-line stylesheet went into the app verbatim, with 14 primitives built on its classes. The results page polls once a second while a search runs, and a status change shows at once, before the server confirms it.",
        },
      ],
    },
    { kind: "statement", text: "A failed check lowers confidence, not the score." },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "Two bugs made it through every per-task review. A PostgREST query tried to embed a lead’s status across a relationship the schema only has indirectly, and the radius slider did nothing because the search never passed the geocoded center. The final review across the whole implementation caught both; reviews scoped to one diff could not.",
        "Other lessons were smaller and sharper. Exporting maxDuration from a server-action file passes the typecheck and fails only the production build; it belongs on the page that renders the form. Screenshot links were signed for 30 days, so old lead pages would have lost their images; the app now stores paths and signs them when a page is read. Site addresses come from Google, so every outbound fetch resolves the host first and refuses private, loopback and link-local addresses, on every redirect.",
        "The last two waves of the redesign shipped on tests and a clean build rather than a walk through the browser, because local sign-in was blocked at the time.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "Lead Finder is deployed on Vercel with magic-link sign-in for a single user. Every table is scoped to that user with row-level security, so the schema is ready for more than one. The second version is complete: search, results, lead detail, outreach templates and a compose panel, with 156 unit tests passing and a clean production build as of June 2026.",
        "The compose panel doesn’t send email yet: Send calls a mock. The repository is private, so there is no public link.",
      ],
    },
  ],
};
