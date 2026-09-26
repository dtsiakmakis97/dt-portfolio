"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLenis } from "lenis/react";

/** next/link that stops Lenis inertia before the route commits, so the old
 *  page's momentum can't carry into the new page. Pick the page transition
 *  with `transitionTypes` from lib/vt.ts. */
export function TransitionLink({ onNavigate, ...props }: ComponentProps<typeof Link>) {
  const lenis = useLenis();
  return (
    <Link
      {...props}
      onNavigate={(event) => {
        lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
        onNavigate?.(event);
      }}
    />
  );
}
