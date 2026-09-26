/** The only source of view-transition names and types. A duplicate
 *  view-transition-name on one page aborts the whole transition, so never
 *  hand-write these strings anywhere else. */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";
export const VT_HEADER = "site-header";
export const vtTitle = (slug: string) => `project-title-${slug}`;
export const vtMedia = (slug: string) => `project-media-${slug}`;
