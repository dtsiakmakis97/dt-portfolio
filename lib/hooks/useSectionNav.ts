"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/** The fixed header's height plus breathing room. Keep in sync with
 *  `scroll-padding-top: 5.5rem` in app/globals.css. */
export const HEADER_OFFSET = 88;

/** Click handler for "/#section" links. On the home page it takes over the
 *  jump: smooth scroll (Lenis when active), update the hash, then move focus
 *  to the section for keyboard and screen-reader users. Elsewhere (or with a
 *  modifier key) it does nothing and the link navigates normally. */
export function useSectionNav() {
  const pathname = usePathname();
  const lenis = useLenis();

  return (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = href.split("#")[1];
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    history.pushState(null, "", `#${id}`);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    const focus = () => target.focus({ preventScroll: true });

    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.2, onComplete: focus });
    } else {
      target.scrollIntoView({ block: "start" });
      focus();
    }
  };
}
