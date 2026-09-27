import { optimizedSrcSet } from "@/lib/image";
import { experience, hero, nav, profile, projects, stackMarquee, type NavLink } from "@/lib/content";

/** A section's row in the full-screen menu, with what the section holds.
 *  Only the root layout (a server component) imports this module's values and
 *  passes the rows down as props: its top-level calls would otherwise pull the
 *  whole content module into the client bundle. Client code imports types only. */
interface CoverProps {
  readonly src: string;
  readonly srcSet: string;
  readonly sizes: string;
  readonly width: number;
  readonly height: number;
}

export interface MenuRow extends NavLink {
  /** Run past in the row's band. Work's carry each project's cover as plain
   *  <img> props on the optimizer's srcset: importing next/image anywhere in
   *  the layout's graph ships its client component on every page. */
  readonly facts: readonly { readonly text: string; readonly cover?: CoverProps }[];
}

const text = (items: readonly string[]) => items.map((item) => ({ text: item }));

/** Drawn from the content above, so the menu never says more than the page does. */
const sectionFacts: Readonly<Record<string, MenuRow["facts"]>> = {
  about: text([profile.role, ...hero.available.split(" · ").slice(1)]),
  work: projects.map(({ name, cover }) => ({
    text: name,
    cover: cover && { ...optimizedSrcSet(cover.src, cover.width), sizes: "16rem", width: cover.width, height: cover.height },
  })),
  experience: text(experience.flatMap((item) => [item.company, item.role, item.period])),
  stack: text(stackMarquee),
  contact: text([profile.email, profile.location]),
};

export const menuRows: readonly MenuRow[] = nav.map((item) => ({ ...item, facts: sectionFacts[item.href.slice(2)] ?? [] }));
