import type { CaseStudy } from "./types";

/*
 * Kryora case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §7.
 *
 * Sources: W/projects/kryora-website.md; S/2026-09-23-kryora-greek-redesign-and-vercel-preview-session.md;
 *   W/hot.md (09-23b, 09-25, 09-26 summaries); P/Kryora - Website/{package.json, PRODUCT.md,
 *   src/lib/finder.ts}; git log.
 *   Re-verified 2026-09-26 against src/lib/finder.ts (venue, sessions band, 230/400/unsure; first
 *   and smallest model that fits; needs400 and checkPower notes; physio with 400 V gets at least
 *   the clinic-grade model) and the 09-23 session (server-only toLocaleUpperCase, hand-rolled
 *   number formatters, the @property countdown, localeDetection false, the preset-Other 404s,
 *   axe and oklch), plus the project page (22 tests; CSS-first motion) and the 09-25 session
 *   (iOS counter). No new imagery until client sign-off; the hero is the credited cover. No links.
 *
 * Must not say (the fact sheet's list, reworded so e2e/content.spec.ts's gate stays exact):
 *   payback-calculator numbers or defaults, prices, kWh figures; exclusivity; self-run audit
 *   scores; the preview URL and the direction-board link; SEO as an outcome (foundations only,
 *   noindexed); the type designer's personal name (say a Greek type designer); clinic or hospital
 *   scenes (planned); testimonials or reference installations (none).
 *
 * Word budget: 600-800.
 */
export const kryora: CaseStudy = {
  lead: "Kryora is a Greek-first B2B site for ProseQ whole-body cryotherapy chambers, a Greek-market rebuild of kryora.de. It is a front-end preview waiting for the client’s sign-off, kept out of search engines.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "The buyers are Greek businesses making a capital purchase: hotels, resorts and villas, sports clubs and physio practices, even yachts. The chambers run at −110 °C for three-minute sessions, in six eCham models and a five-in-one vita cabin.",
        "I set the direction, designed and built it solo over four days in September 2026, in Next.js 16 with next-intl, Tailwind v4 and no animation library.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "A buyer has three questions before a call: is this credible and safe, will it fit my space and my power supply, and what does the payback look like. The site’s job is to answer them plainly and turn the interest into a qualified enquiry, without promising returns.",
      ],
    },
    { kind: "statement", text: "−110 °C, counted in CSS." },
    {
      kind: "decisions",
      items: [
        {
          summary: "A direction grounded in references, critiqued into rules",
          body: "The direction came from Refero references for the mood, the hero and the navigation, and a design critique became audit rules the build follows: no section eyebrows or numbering, one label per call to action, nothing laid over images. On 25 September the palette moved from a cold cinematic look to Obsidian & Champagne: warm near-black, cream actions and one champagne accent.",
        },
        {
          summary: "Headings in Commissioner, from a Greek type designer",
          body: "The default display face had no Greek glyphs at all. Commissioner, from a Greek type designer, sets both scripts with the same character; Inter carries the body text.",
        },
        {
          summary: "Greek uppercase and numbers without hydration drift",
          body: "Greek capitals drop the tonos but keep the dialytika, so headings are uppercased on the server only, with toLocaleUpperCase('el'), never in the browser. Prices use hand-rolled formatters, because Intl.NumberFormat can differ between the server’s and the browser’s ICU data and break hydration.",
        },
        {
          summary: "CSS-first motion; GSAP left out",
          body: "GSAP was rejected for its weight, its main-thread work and the layout shift its pin spacers cause. The −110 °C countdown animates a registered integer property through a CSS counter, gated on support and on reduced motion; browsers without scroll-driven animation get static layouts.",
        },
        {
          summary: "A three-question model finder",
          body: "Venue type, sessions a day and power supply (230 V, 400 V or unsure) return the smallest model that fits, with a note when it needs three-phase power or the supply should be checked. Physio practices with 400 V get at least the clinic-grade model.",
        },
        {
          summary: "Search foundations, kept out of search",
          body: "Greek lives at the root and English under /en, with locale detection off so an English browser isn’t redirected away from Greek. Subpages have Greek slugs, per-page canonicals, hreflang and Open Graph, structured data without offers, and a sitemap. They are foundations: the preview is noindexed on three layers until launch.",
        },
      ],
    },
    { kind: "statement", text: "Uppercase, without the tonos." },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "The first deploy returned 404 on every route: creating the Vercel project from the command line set its framework preset to Other, so nothing Next-shaped was built until the preset was pinned. On iOS, WebKit interpolated the countdown’s integer fractionally and it showed 0 until the value was rounded.",
        "axe could not parse oklch colors, so its contrast checks came back incomplete while a zero-violation gate still passed; I sampled contrast from rendered pixels instead. And the six Greek nav labels need a full 1024 pixels, so below that the menu button takes over.",
        "Two smaller surprises: Lightning CSS splits color-mix into an @supports fallback, and a pinned horizontal pan broke only with motion switched on.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "The preview is live and noindexed, with 22 Vitest tests and lint, typecheck, tests and build all passing. It is waiting on the client’s sign-off and a ten-item backlog.",
        "The contact form sends nothing yet: there is no backend behind it.",
      ],
    },
  ],
};
