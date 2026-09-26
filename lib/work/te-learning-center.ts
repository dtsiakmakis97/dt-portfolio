import type { CaseStudy } from "./types";

/*
 * T.E. Learning Center case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §6.
 *
 * Sources: W/projects/te-learning-center.md; S/2026-06-10-te-learning-center-photos-and-contact-session.md;
 *   P/Language School Website/{package.json, PRODUCT.md, CLAUDE.md}; git log.
 *   Re-verified 2026-09-26 against W/projects/te-learning-center.md (Greek as the source language,
 *   tested at Greek length; all copy in one module, no CMS/API/DB; the Friendly Schoolhouse
 *   rebrand of 2026-05-24; the wrong-city placeholder; the school's own existing website) and the
 *   06-10 session (all photos from one open-day event, none of lessons, so community only; mixed
 *   orientations broke the first crops; lazy images looked broken in full-page screenshots).
 *
 * Must not say (the fact sheet's list, reworded so e2e/content.spec.ts's gate stays exact):
 *   the event photos themselves (identifiable people, including minors); any accessibility
 *   standard claim (a 2.1 AA target, never audited); which language the school teaches as a
 *   settled fact (the signage says English and IT, the site says English only: unresolved, say
 *   language school); opening hours (placeholders); phone, email, address, map coordinates;
 *   the preview address as the school's official site.
 *
 * Word budget: 300-500.
 */
export const teLearningCenter: CaseStudy = {
  lead: "T.E. Learning Center is a Greek-first site for a private language school in Chalkidiki, written for parents first. It is live on Vercel as a separate site; the school’s own domain still has its existing website.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "Parents decide, usually on a phone in the evening; students and adult learners read along. The school teaches every level from A1 to C2, and the site is purely informational: no booking, no login, no portal. I designed and built it solo between May and June 2026, in Next.js 14 with plain JavaScript and CSS custom properties.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "The site had to present a small school as trustworthy and distinct from the usual Greek tutoring center, explain the path from A1 to C2 honestly, and make contact effortless.",
      ],
    },
    { kind: "statement", text: "Greek is the source, not a translation." },
    {
      kind: "decisions",
      items: [
        {
          summary: "Greek is the source language",
          body: "Every layout is tested at real Greek length, which runs about a fifth longer than English, never at Latin placeholder text, and the page declares its language as Greek.",
        },
        {
          summary: "All copy in one module, tokens in CSS, nothing else",
          body: "Every word on the site lives in one content module and every design token in the global stylesheet. There is no CMS, no API and no database for a small school to maintain.",
        },
        {
          summary: "Trust by restraint",
          body: "No urgency, no scarcity, no fake social proof and no aggressive calls to action. Concrete specifics, like the size of a class, do the persuading instead of adjectives.",
        },
        {
          summary: "From a quiet schoolhouse to a friendly one",
          body: "On 24 May 2026 the first, quieter direction gave way to the Friendly Schoolhouse: rounded Comfortaa headings, a warm accent, the school’s owl mark and a voice written for parents.",
        },
        {
          summary: "Honest imagery",
          body: "The only photos that exist come from one open-day event, and none show a lesson. So they appear only as community and atmosphere, never as a picture of what a lesson looks like.",
        },
      ],
    },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "Early sessions placed the school in the wrong city, a placeholder that had to be corrected across the copy, the map and the docs. The event photos mix landscape and portrait, which broke the first crops until the crop helper read each file’s real orientation. And lazy-loaded images looked like a bug in full-page review screenshots, though they load normally for visitors.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "The site is live with real contact details and an exact map pin, and the first real photos went up on 10 June 2026.",
      ],
    },
  ],
};
