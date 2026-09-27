"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, profile } from "@/lib/content";
import type { MenuRow } from "@/lib/menu";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { SectionLink } from "@/components/motion/SectionLink";
import { pill } from "@/components/ui/pill";
import { VT_HEADER } from "@/lib/vt";
import { SiteMenu } from "./SiteMenu";

// "top" is tracked too, so while the hero is in view no nav item is current.
const SECTION_IDS = ["top", ...nav.map((item) => item.href.slice(2))]; // "/#about" -> "about"
const NO_SECTIONS: readonly string[] = [];

/** Past this share of the viewport (the hero, on home) the header collapses. */
const COLLAPSE_AT = 0.85;

/** Fixed header: transparent over the hero, solid on scroll. At the top it
 *  shows every section inline; past the hero the links fold up out of their
 *  masks, the section in view is named in their place, and a Menu pill opens
 *  the full-screen menu. Active-section tracking runs on the home page only;
 *  on a case study, "Work" is current. Its view-transition name keeps it
 *  pinned during page transitions. */
export function TopBar({ menu }: { menu: readonly MenuRow[] }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome ? SECTION_IDS : NO_SECTIONS);
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setCollapsed(window.scrollY > window.innerHeight * COLLAPSE_AT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCurrent = (id: string) =>
    onHome ? active === id : id === "work" && pathname.startsWith("/work/");
  const currentLabel = nav.find((item) => isCurrent(item.href.slice(2)))?.label;

  return (
    <header
      style={{ viewTransitionName: VT_HEADER }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-glide ${
        scrolled ? "bg-canvas" : "bg-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between gap-6 px-gutter py-4">
        {/* data-shelter: over the hero, the lens field stays dark enough behind these for 4.5:1. */}
        <SectionLink
          href="/#top"
          data-shelter=""
          data-wordmark=""
          className="font-display text-xl font-extrabold tracking-tight text-ink transition-colors duration-300 hover:text-blue"
        >
          DT<span className="text-blue">.</span>
        </SectionLink>

        {/* Section links only: the mobile dialog lives outside this landmark so
            the page never has nested navs or duplicate section links in it. */}
        <nav aria-label="Primary" data-shelter="" inert={collapsed} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item, i) => {
              const current = isCurrent(item.href.slice(2));
              return (
                <li key={item.href}>
                  <SectionLink
                    href={item.href}
                    aria-current={current ? "true" : undefined}
                    className={`group relative font-mono text-label uppercase transition-colors duration-300 ${
                      current ? "text-ink" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {/* Folds up out of its mask once the header collapses. */}
                    <span className="inline-block overflow-hidden align-bottom">
                      <span
                        className={`inline-block transition-transform duration-700 ease-glide ${collapsed ? "-translate-y-[120%]" : ""}`}
                        style={{ transitionDelay: `${i * 40}ms` }}
                      >
                        {item.label}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-blue transition-transform duration-500 ease-glide ${
                        current && !collapsed ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* The wrapper owns display: pill() sets inline-flex, which would beat `hidden`. */}
        <div data-shelter="" className={collapsed ? "hidden" : "hidden md:block"}>
          <a href={`mailto:${profile.email}`} className={pill("ghost")}>
            Email
          </a>
        </div>
        <SiteMenu collapsed={collapsed} rows={menu} />

        {/* Once collapsed, the section in view, where the links were. */}
        <span
          data-current-section=""
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-label uppercase text-ink-2 transition-[opacity,visibility] duration-500 ease-glide ${
            collapsed && currentLabel ? "" : "invisible opacity-0"
          }`}
        >
          {currentLabel}
        </span>
      </div>
    </header>
  );
}
