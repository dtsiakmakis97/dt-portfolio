/** The only source of view-transition names and types. A duplicate
 *  view-transition-name on one page aborts the whole transition, so never
 *  hand-write these strings anywhere else. */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";
export const VT_HEADER = "site-header";
export const vtTitle = (slug: string) => `project-title-${slug}`;
export const vtMedia = (slug: string) => `project-media-${slug}`;

/** `share` for every shared element. Morphs run on typed (link) navigations
 *  only. Back/Forward carry no transition type, so they fall to `default` and
 *  swap instantly, like the root: a morph toward a row the browser has not
 *  scrolled back to yet would fly in from nowhere. */
export const SHARE_ON_NAV = { [NAV_FORWARD]: "morph", [NAV_BACK]: "morph", default: "none" } as const;

/** Page-level curtain. React cancels the root snapshot when no ViewTransition
 *  changed layout, so each page wraps its content in one ViewTransition: the
 *  old page exits (lifts or drops over the blue ground its group carries) and
 *  the new page enters (reveals or rises). Untyped navigations fall to
 *  `default` and swap instantly. */
export const CURTAIN_EXIT = { [NAV_FORWARD]: "curtain-lift", [NAV_BACK]: "curtain-drop", default: "none" } as const;
export const CURTAIN_ENTER = { [NAV_FORWARD]: "curtain-reveal", [NAV_BACK]: "curtain-rise", default: "none" } as const;
