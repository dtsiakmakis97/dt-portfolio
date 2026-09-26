import { meta, profile } from "@/lib/content";

/** Open Graph fields every page repeats. Metadata merges shallowly, so a
 *  page that sets `openGraph` must restate these itself. */
export const baseOpenGraph = { siteName: profile.name, locale: "en_US" } as const;

/** The site's own card, set by the root layout. A page that keeps the site
 *  card but changes one field (the 404 drops `url`) spreads this. */
export const siteOpenGraph = {
  title: meta.title,
  description: meta.description,
  type: "website",
  url: "/",
  ...baseOpenGraph,
} as const;
