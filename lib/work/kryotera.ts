import type { CaseStudy } from "./types";

/*
 * Kryotera case study (built as Kryora). Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §7.
 *
 * Sources: W/projects/kryora-website.md; S/2026-09-23-kryora-greek-redesign-and-vercel-preview-session.md;
 *   S/2026-10-06-kryora-client-corrections-session.md; S/2026-10-06-kryotera-go-live-session.md;
 *   W/hot.md; P/Kryora - Website/{package.json, DESIGN.md "Decision (2026-09-27)", PRODUCT.md,
 *   src/lib/finder.ts}; git log (25 commits, 2026-09-23 to 2026-10-06).
 *   Re-verified 2026-10-06: live and indexable at kryotera.gr (92dd52c); "down to −110 °C" is the
 *   client's wording; the Ink & Ice palette and the oklab tint fix (DESIGN.md); the server action
 *   called from onSubmit, the shared seven-field validator, honeypot, BotID, Resend, table HTML
 *   with hex colors, no auto-reply, the LEGAL_APPROVED launch guard, the [locale] 404s fixed with
 *   dynamicParams=false plus global-not-found, the BotID proxy matcher and the Footer.tagline
 *   MISSING_MESSAGE (both 10-06 sessions); 53 Vitest tests (pnpm test). The cover is the live Greek
 *   hero, captured 2026-10-06; the scenes are still kryora.de's AI renders, so it stays credited.
 *
 * Must not say (the fact sheet's list, reworded so e2e/content.spec.ts's gate stays exact):
 *   payback-calculator numbers or defaults, prices, kWh figures; exclusivity (the client's claim,
 *   not ours); self-run audit scores; the vercel.app URL and the direction-board link; SEO results
 *   (it is open to search, with no ranking data); the type designer's personal name (say a Greek
 *   type designer); clinic or hospital scenes (planned); testimonials or reference installations
 *   (none); the operator's personal name or the client's company status.
 *
 * Word budget: 700-1000.
 */
export const kryotera: CaseStudy = {
  lead: "Kryotera is a Greek-first B2B site for ProseQ whole-body cryotherapy chambers. It began as Kryora, a Greek-market rebuild of kryora.de, and went live at kryotera.gr on 6 October 2026, with a working enquiry form and bilingual legal pages.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "The buyers are Greek businesses making a capital purchase: hotels, resorts and villas, sports clubs and physio practices, even yachts. The chambers go down to −110 °C for three-minute sessions, in six eCham models and a five-in-one vita cabin.",
        "I set the direction, designed and built it solo: the front end in four days in late September 2026, the client’s new name and logo the day after, then the enquiry backend, the legal pages and the launch on 6 October. It runs on Next.js 16 with next-intl and Tailwind v4, and no animation library.",
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
          body: "The direction came from Refero references for the mood, the hero and the navigation, and a design critique became audit rules the build follows: no section eyebrows or numbering, one label per call to action, nothing laid over images. The palette changed twice: from a cold cinematic look to Obsidian & Champagne, then, when the client’s logo arrived, to Ink & Ice, with navy-black surfaces and one ice-blue accent taken from the logo, never used as a fill.",
        },
        {
          summary: "Greek done properly, from the typeface to the capitals",
          body: "The default display face had no Greek glyphs at all, so headings are set in Commissioner, from a Greek type designer, with Inter for body text. Greek capitals drop the tonos but keep the dialytika, so headings are uppercased on the server only, with toLocaleUpperCase('el'). Prices use hand-rolled formatters, because Intl.NumberFormat can differ between the server’s and the browser’s ICU data and break hydration.",
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
          summary: "An enquiry form that keeps what the visitor typed",
          body: "The form calls a server action from its submit handler, not through the form’s action prop, because React 19 resets uncontrolled inputs after a form action and a failed send would wipe the message. One hand-written validator for seven fields runs in the browser and again on the server, after a honeypot and Vercel BotID, so no validation library ships to the client. Resend delivers a branded email built from tables and hex colors, since mail apps don’t parse oklch. There is no auto-reply: it would let anyone make the site email any address.",
        },
        {
          summary: "Search foundations, gated until launch",
          body: "Greek lives at the root and English under /en, with locale detection off so an English browser isn’t redirected away from Greek. Subpages have Greek slugs, per-page canonicals, hreflang and Open Graph, structured data without offers, and a sitemap. The preview stayed noindexed on three layers, and a guard in the Next config fails any indexable build until the legal pages are approved. Launching meant flipping that approval and setting two environment variables.",
        },
      ],
    },
    { kind: "statement", text: "Uppercase, without the tonos." },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "The first deploy returned 404 on every route: creating the Vercel project from the command line set its framework preset to Other, so nothing Next-shaped was built until the preset was pinned. On iOS, WebKit interpolated the countdown’s integer fractionally and it showed 0 until the value was rounded.",
        "axe could not parse oklch colors, so its contrast checks came back incomplete while a zero-violation gate still passed; I sampled contrast from rendered pixels instead. The rebrand found another color trap: the build lowers the tokens to lab(), and on the way back to oklch Chrome dropped a low-chroma color’s hue but kept its chroma, so the navy-black header scrim rendered red until tints were mixed in oklab.",
        "Launch day had its own. Unknown URLs such as /nope.php returned 500, not 404, because a not-found page inside a dynamic locale layout has no locale to render with, and only a production build showed it; turning dynamic params off and adding a global not-found page fixed it. Bot protection needed its path excluded from the i18n proxy, and deleting one translation key threw at render, because the home page’s structured data still read it, while tests, types and lint all passed.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "Kryotera has been live and open to search engines at kryotera.gr since 6 October 2026, the same day the client’s corrections shipped. Enquiries reach the client’s inbox through Resend; three test leads arrived, the last from the deployed site. Lint, typecheck, build and 53 Vitest tests pass.",
        "Still open: a postal address for the legal pages, per-model prices and real installation photos. The scenes on the site, and on this page, are kryora.de’s AI renders.",
      ],
    },
  ],
};
