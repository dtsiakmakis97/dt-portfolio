import type { CaseStudy } from "./types";

/*
 * Ego Distillers case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §4.
 *
 * Sources: W/projects/egodistillers-website.md; S/2026-08-24-egodistillers-nextjs-rebuild-session.md;
 *   S/2026-08-31…client-batch-2; S/2026-09-01…mobile-booking; S/2026-09-01…resend-wiring;
 *   S/2026-09-02…resend-domain-verification; S/2026-09-14…menu-update; S/2026-09-23…seo-audit;
 *   P/Egodistillers Website/web/{package.json, PRODUCT.md, DESIGN.md, README.md}; git log;
 *   portfolio-screenshots/.
 *   Re-verified 2026-09-26 against the 08-24 session (typed Dictionary; next-intl rejected;
 *   in-modal bokabord iframe after a framing-header check, Understory forbids framing; menu as
 *   code, PDF the source and fallback) and the 09-02 session (one.com records, cutover the same
 *   afternoon, cert about 25 minutes after the flip; no-mailbox sender with reply_to; live submit
 *   reached the client inbox), plus the 09-01, 09-14 and 09-23 sessions. The age gate is left out:
 *   the fact sheet says 18+, the 08-24 session says 25+.
 *
 * Must not say: the Emergent.sh CRA prototype as the user's work; legal entity name or org
 *   number; the audit score or its category scores; free or original design (the architecture
 *   lane, teal accent, typeface and age gate are client-mandated: say the design direction was
 *   client-set); the client's claim to be the city's first distillery as the user's assertion
 *   (attribute it or leave it out; it is left out); client emails, bokabord venue hashes.
 *   Figures: the user's own captures of the live site, checked for people (none).
 *
 * Word budget: 700-1000.
 */
export const egoDistillers: CaseStudy = {
  lead: "Ego Distillers is a Swedish and English site for a Gothenburg distillery with a bar and a restaurant. I built it within a client-set design direction, and it has been live on the client’s own domain since 2 September 2026.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "Ego Distillers makes five house spirits and runs two venues, with tastings and other experiences alongside. Their old site was a WordPress one-pager. Most visitors arrive on a phone, planning a night out or a tasting; press and trade come looking for the spirits.",
        "The look was set by the client, down to the accent color and the typeface. My part was the build and every integration behind it, solo, from 24 August 2026 through the September cutover and the rounds after it: Next.js 16 and React 19 on Vercel, Tailwind v4, and Resend for the one form.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "The site had to do real work, not just look right. Guests book tables at two venues, read the menu and learn about each spirit, and bars and brands ask to collaborate, in Swedish or in English.",
        "Both languages had to be complete on every page, and none of those actions could dead-end: a booking that opens the wrong venue or a form that quietly loses a message is worse than no site at all.",
      ],
    },
    { kind: "statement", text: "A missing translation is a compile error." },
    {
      kind: "decisions",
      items: [
        {
          summary: "Typed dictionaries instead of an i18n library",
          body: "Routes carry the language, and every page reads from a typed dictionary, so a key missing in either locale fails the typecheck instead of shipping a blank. With two locales and no plural rules to speak of, next-intl would have added weight for nothing, so I left it out.",
        },
        {
          summary: "Table booking inside the site",
          body: "Choosing a venue swaps the booking modal to an embedded bokabord calendar, so guests never leave the page. Before promising that, I checked each provider’s framing headers: bokabord allows embedding and Understory forbids it, so tastings stay a link that opens in a new tab.",
        },
        {
          summary: "The menu is code; the PDF stays the source",
          body: "The restaurant’s one-page PDF menu is transcribed into a typed module and shown in a modal, readable on a phone without a download. The PDF stays the source of truth and the fallback link; when the menu changes, the module is updated to match.",
        },
        {
          summary: "One form, wired properly: Resend, a honeypot, a verified sender",
          body: "The collaboration form posts to Resend’s API, with its keys kept in Infisical. A honeypot field catches bots and shows them a success message without sending anything. Once the client’s domain was verified, mail goes out from an address on that domain with no mailbox behind it and reply_to set to the visitor, so a reply reaches the person who wrote.",
        },
        {
          summary: "Accent contrast checked on every surface",
          body: "The client’s teal works on the ivory pages but reads at about 2:1 as text on the dark footer. There, a lighter token of the same hue carries the text hovers, so the accent stays the client’s and the contrast holds.",
        },
        {
          summary: "Canonicals per page; redirects only where the content matches",
          body: "Canonical links are set on each page, never in the shared layout: Next merges metadata shallowly, so a layout canonical would leak onto the 404 page. Old WordPress URLs get permanent redirects only where a new page carries the same content.",
        },
      ],
    },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "On phones, the embedded booking calendar stayed in its desktop layout and could not reach later months. The cause was on my side: the modal’s margins and padding left the iframe just under the width where the widget switches layouts. Tighter margins on small screens, and an iframe that bleeds through the padding, fixed it.",
        "The domain cutover had to happen without the client’s WordPress admin, which couldn’t reach DNS. Verification and the switch went through the records at the registrar, one.com, with its bundled IPv6 record turned off; Vercel issued the certificate on its own about 25 minutes later.",
        "Two smaller ones: an orphaned grid span doubled the Triple Orange card on phones, and the parallel agents of an SEO audit probed the site hard enough to trip Vercel’s Security Checkpoint for my own address.",
      ],
    },
    {
      kind: "figure",
      figure: {
        src: "/work/ego-distillers-mobile.webp",
        width: 390,
        height: 842,
        alt: "Ego Distillers home page on a phone: a close-up of a copper still behind the client’s headline, with Our spirits and Collaborate with us buttons",
        caption: "Home, on a phone",
      },
    },
    {
      kind: "figure",
      figure: {
        src: "/work/ego-distillers-tastings.webp",
        width: 1280,
        height: 960,
        alt: "Tastings & More page on desktop: jars of dried botanicals behind the headline Taste, create & explore, with the experiences listed beside a Book your experience button",
        caption: "Tastings & More, desktop",
      },
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "Ego Distillers has been live on egodistillers.com since 2 September 2026. The collaboration form was verified end to end that day, from a submit on production to the client’s inbox, and menu updates now ship as code. Analytics, structured data, canonicals, redirects and security headers are live.",
      ],
    },
    { kind: "statement", text: "Booking never leaves the page." },
  ],
};
