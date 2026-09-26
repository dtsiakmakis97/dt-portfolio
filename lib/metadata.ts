import { profile } from "@/lib/content";

/** Open Graph fields every page repeats. Metadata merges shallowly, so a
 *  page that sets `openGraph` must restate these itself. */
export const baseOpenGraph = { siteName: profile.name, locale: "en_US" } as const;
