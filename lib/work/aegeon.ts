import type { CaseStudy } from "./types";

/*
 * Aegeon case study. Fact sheet: ~/.claude/plans/redesign-case-study-facts.md §3.
 *
 * Sources: W/projects/aegeon-website.md; S/2026-06-17-aegeon-production-launch.md;
 *   S/2026-07-09-aegeon-golive-corrections-session.md;
 *   S/2026-07-13-aegeon-frontend-photos-and-fe-adjustments-session.md; W/log.md;
 *   P/Aegeon - Website/{README.md, PRODUCT.md, DESIGN.md, TODO.md, package.json, vercel.json}; git log.
 *   Re-verified 2026-09-26 against the 07-09 session (request flow; Stripe out of the guest path;
 *   a pending request does not block availability, which keys off confirmed) and the 07-13
 *   session (today computed server-side in Europe/Athens; the first fix a misdiagnosis), plus
 *   the launch session, the project page, W/log.md (free-tier pause), the 06-16 session (294
 *   keys at parity), the 05-25 palette session (token-only swap) and messages/en.json (adults only).
 *
 * Must not say: original visual design (owner Claude Design handoffs 2026-05-22, 05-25, chat);
 *   Stripe/deposit checkout; aegeon.net as live URL; working email notifications or live OTA
 *   sync; "~15–18% commission saved", infra costs, prices/fees; hosts' portrait; stale
 *   README/DESIGN claims (Stripe 30% deposit, "stone garden"); owner names/emails/phones/partner codes.
 *
 * Word budget: 800-1000.
 */
export const aegeon: CaseStudy = {
  lead: "Aegeon is a German, English and Greek site for a family-run, five-unit sea-view rental in Chalkidiki, live since 17 June 2026. Guests request a booking; the owners confirm it. I built it from the owners’ Claude Design handoffs.",
  blocks: [
    {
      kind: "prose",
      label: "Context",
      paragraphs: [
        "The owners rent five units above the Aegean to German-speaking travellers who want quiet: adults only, a sea view, away from mass tourism. Their old site was an inquiry-only site-builder template, and keeping Airbnb and Booking.com in step meant syncing calendars by hand.",
        "I rebuilt it solo between May and July 2026: Next.js 16 with next-intl for the three languages, Supabase in Frankfurt for the data and the owners’ admin, and Vercel Cron for the calendar jobs. The visual system came from the owners’ own design handoffs, made in Claude Design; my part was turning it into a working site.",
      ],
    },
    {
      kind: "prose",
      label: "Problem",
      paragraphs: [
        "Direct bookings could not be allowed to collide with the booking platforms. The same five units sell on Airbnb and Booking.com, whose calendars refresh on their own schedule, so the site needed one place that knows every blocked night and a margin for the platforms’ lag.",
        "The three languages also had to be equals. German is the default for this audience, but English and Greek needed the same pages and the same keys, kept in step with every change rather than translated once and left behind.",
      ],
    },
    { kind: "statement", text: "Bookings are requests, not payments." },
    {
      kind: "decisions",
      items: [
        {
          summary: "Supabase as the single source of truth",
          body: "Units, prices, photos and every blocked night live in Supabase; marketing copy lives in the translation files. Anonymous visitors can read the catalog and insert a booking request or an inquiry, and nothing more: the tables that hold guest details are insert-only for them and readable only by the owners.",
        },
        {
          summary: "A calendar sync of our own, not a rented channel manager",
          body: "I weighed a managed property-management system, Smoobu, and chose a small sync of our own. A cron job pulls the Airbnb and Booking.com feeds every 15 minutes, the site publishes its own feed for each unit, and a nightly reconcile checks for drift. Availability keeps a 24-hour buffer against outside bookings, which absorbs the platforms’ refresh lag.",
        },
        {
          summary: "Requests instead of payments",
          body: "The owners’ go-live checklist, three weeks after launch, asked for requests instead of payments, and on 9 July 2026 I took Stripe out of the guest path. A booking now arrives as a pending request; the owners review it and send the deposit link by hand. A pending request never blocks the calendar, only a confirmed booking does, so the old 30-minute sweep that cancelled unpaid holds had to go.",
        },
        {
          summary: "Today is Athens time, computed once on the server",
          body: "The booking calendar logged a hydration mismatch: the server worked out “today” in UTC and a visitor’s browser in its own time zone, and around midnight the two disagreed. The fix computes today once on the server, in Europe/Athens, and passes it down, so the server and every browser agree on which nights can be booked.",
        },
        {
          summary: "Privacy-light embeds and native primitives",
          body: "The contact map is an OpenStreetMap embed rendered on the server with no script, in place of a Google map that needed a consent gate. The gallery lightbox and the mobile menu are native dialog elements, which bring focus handling and the Escape key with them.",
        },
        {
          summary: "Tokens and secrets that change in one place",
          body: "When the owners settled their brand palette, the swap touched only the design tokens: all 24 components read their colors through them, so no component changed. Secrets live in Infisical and sync to Vercel; the public keys are inlined at build time, which mattered at launch.",
        },
      ],
    },
    { kind: "statement", text: "Today is computed in Athens." },
    {
      kind: "prose",
      label: "Challenges",
      paragraphs: [
        "Launch day went wrong twice. A rollback pin left over from an earlier outage kept production on an old deploy while new builds reported success; a page that only existed in the new code, returning 404, gave it away. Then every page that reads the database failed, because a wrong anon key had been baked into the bundle at build time. Both taught the same lesson: a green build is not a working site until the rendered pages say so.",
        "Earlier, the free-tier Supabase project paused while idle and its host stopped resolving. Later, a pricing migration had to reach the database before the code that read its new columns, or the unit pages would fail. Across 294 translation keys, German, English and Greek had to stay at parity through every change.",
        "My first fix for the calendar’s hydration error was a misdiagnosis: removing a search-params hook changed nothing. The real cause was the time zone.",
      ],
    },
    {
      kind: "prose",
      label: "Outcome",
      paragraphs: [
        "Aegeon launched on 17 June 2026. The request flow went live on 9 July, verified with a real quote through the availability API against the migrated database, and 51 commissioned photos are on the site.",
        "Two things are not done yet. Booking-request emails aren’t wired, so requests reach the owners’ admin without a notification. And the calendar jobs are built and scheduled, but I haven’t confirmed that the owners’ Airbnb and Booking.com feeds are connected.",
      ],
    },
  ],
};
