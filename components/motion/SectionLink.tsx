"use client";

import type { ComponentProps, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./TransitionLink";
import { useSectionNav } from "@/lib/hooks/useSectionNav";
import { NAV_BACK } from "@/lib/vt";

type SectionLinkProps = Omit<ComponentProps<typeof TransitionLink>, "href"> & {
  href: `/#${string}`;
};

/** Link to a home-page section. On the home page it scrolls and focuses the
 *  section; elsewhere it navigates home with the backward page transition and
 *  the browser lands on the hash. */
export function SectionLink({ href, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();
  const scrollToSection = useSectionNav();
  return (
    <TransitionLink
      {...props}
      href={href}
      transitionTypes={pathname === "/" ? undefined : [NAV_BACK]}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollToSection(event, href);
      }}
    />
  );
}
