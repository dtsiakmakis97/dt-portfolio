import { projects } from "@/lib/content";
import type { CaseStudy } from "./types";

const cover = projects.find((project) => project.slug === "pawguard")!.cover!;

/*
 * PawGuard case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §1.
 *
 * Sources: W/projects/pawguard.md, W/projects/pawguard-onepage.md,
 *   S/2026-05-10-pawguard-scaffold-rebuild-session.md; P/PawGuard - Product/{README.md,
 *   CLAUDE.md, TODO.md, package.json, docs/reviews/{privacy-audit-001,rls-review-001}.md,
 *   docs/session-log/{01,02,06,09}.md, docs/design/{README,HANDOFF-README}.md,
 *   .claude/agents/}; git log.
 *   Re-verified 2026-09-26 against README.md and docs/session-log/2026-04-29-06-relay-end-to-end.md,
 *   plus rls-review-001, privacy-audit-001, CLAUDE.md, session logs 02 and 09 and the rebuild session.
 *
 * Must not say (the fact sheet's list, reworded so e2e/content.spec.ts's gate stays exact):
 *   - the audits as independent (they were the project's own reviewer constitutions, applied
 *     in-line) or as a gate on every merge (one audit round; the rebuild was never merged or pushed);
 *   - that reports reach any authority today, or that the registry / judicial-office integration
 *     exists (it is eventual);
 *   - that the app uses AI or LLMs;
 *   - the visual design as hand-made original work (a Claude Design handoff);
 *   - "under a minute" / "~60 seconds" (a design goal);
 *   - the one-pager heatmap as real data (script-generated);
 *   - the pilot region's name; bootcamp or funding-voucher framing; self-run audit scores;
 *   - the NGO's name or details, the budget, third-party contact emails, Legal folder contents;
 *   - client PII; owner portraits.
 *
 * Word budget: 800-1000.
 */
export const pawguard: CaseStudy = {
  lead: "PawGuard lets anyone in Greece report animal cruelty without giving their name. It is in development: the pilot waits on a GDPR sign-off. I built it alone with four Claude Code subagents; the AI is in how it was built, not in the app.",
  // The same capture at 2x; the 1x cover stays the index preview, so the media morph matches.
  hero: { ...cover, src: "/work/pawguard-2x.webp", width: 2560, height: 1600, caption: "The public one-pager. The app has not launched." },
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "Reporting animal cruelty in Greece today means walking into a police station, giving your name and following up. Most witnesses don’t. The reports that do get filed often arrive without the evidence anyone would need to act on them.",
        "I started PawGuard in late April 2026 as a solo project: a React Native app on Expo, a Supabase backend and a Deno edge function, built with Claude Code. A public one-pager explains the idea; the app itself has not launched.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "The brief was narrow on purpose. A witness should be able to send an anonymous, geotagged, photo-backed report, and the app should route it, by design, to the authorities who can act on it, the local municipality and a partner animal-welfare NGO. Integration with the official registry is an eventual goal, not something the app does.",
        "The harder constraint was the other one: the reporter must never become a privacy liability. Photos carry GPS in their metadata, descriptions carry names, and a database of reports is a list of witnesses. Whatever I built had to be unable to leak any of that, not just unlikely to.",
      ],
    },
    { kind: "statement", text: "Nothing that identifies the witness is stored." },
    {
      kind: "decisions",
      items: [
        {
          summary: "A relay that keeps nothing personal: seven columns",
          body: "Photos, GPS, the description and anything that could identify the reporter are processed in memory inside a Supabase Edge Function, emailed to the recipients and discarded. The database stores exactly seven columns: an id, a one-way reference hash, a coarsened grid cell, the cruelty type, the month, a count and a timestamp. No column could hold personal data even if a writer wanted it to.",
        },
        {
          summary: "Photos stripped twice, locations coarsened to about 10 km",
          body: "The app re-encodes every photo on the device, which drops its EXIF metadata, and the server walks the JPEG structure again and removes the APPn and COM segments. Before anything is stored, the location is coarsened to a grid cell of roughly 10 km, so the statistics can show where cruelty is reported without showing where anyone stood.",
        },
        {
          summary: "The database enforces it: RLS forced, append-only, 11 pgTAP cases",
          body: "Row-level security is enabled and forced, the table is append-only, and there are exactly two policies: anyone may read the aggregates, and only the relay may insert. The anonymous role can’t write at all; Postgres refuses it at the table grant before row-level security even runs. An 11-case pgTAP suite asserts every part of that posture.",
        },
        {
          summary: "Four subagents, each bound by a written constitution",
          body: "I built PawGuard with four Claude Code subagents, one each for the Expo app, the Supabase schema, privacy audits and RLS reviews. Each works under a written constitution that includes the cases where it must refuse. The development database is connected read-only; the production project has no MCP connection and no Claude access at all, and is administered by hand from the dashboard.",
        },
        {
          summary: "Privacy over server-side anti-abuse",
          body: "An anonymous app is easy to spam, and the usual defenses mean tracking the reporter. Instead the rate cap lives in memory on the device and resets with the app, and the server scores each report’s confidence to route it: strong reports are dispatched, weak ones are held for moderation. A check that compares a photo’s GPS with the form’s location sits behind a module boundary that returns only yes or no.",
        },
        {
          summary: "A rebuild: one screen, typed errors, Vitest over Jest",
          body: "In May I rebuilt the scaffold. The three-step wizard became a single report screen, because every tap is a chance for a witness to give up. Every runtime failure became one typed error routed to a single handler, and the form is wiped whenever the app goes to the background. Jest’s React Native preset hit unresolvable conflicts with React Native 0.81 and React 19, so Vitest replaced it.",
        },
      ],
    },
    { kind: "statement", text: "Production is off-limits to the agents." },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "My first pgTAP run was wrong about how the database says no. The tests expected row-level security to reject anonymous writes, but the migration revokes those privileges outright, so Postgres refuses at the table grant first. I rewrote the tests against the real failure and added checks that the row really is unchanged afterwards.",
        "Getting the relay to run end to end took three fixes, each hiding the next. The PDF step failed because its fonts had never been downloaded; the deploy command I was using silently leaves static files out of the bundle; and the Docker daemon the other deploy path needs was stuck until a restart.",
        "The rebuild started with 29 TypeScript errors already on the main branch, most of them because React 19 removed the global JSX namespace. I cleared them first, because until then a clean typecheck would have meant nothing.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "On 29 April 2026 the whole relay ran end to end from a real iPhone against the development project: a Greek PDF went out through Resend to a demo inbox, and the database gained its first two rows of anonymous statistics, from my own test submissions. One privacy audit and one RLS review, both run by the project’s own reviewer constitutions, approved the design with no critical findings. The suites stand at 20 Vitest, 46 Deno and 11 pgTAP tests.",
        "PawGuard hasn’t launched. The pilot waits on a GDPR sign-off, a verified sending domain and confirmed recipient addresses, none of which code can supply.",
      ],
    },
  ],
};
