"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/content";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

const SECTION_IDS = nav.map((n) => n.href.replace("#", ""));

/** Fixed top bar — transparent over the hero, solid on scroll. Tracks the
 * active section, with an animated hairline underline and a mobile panel. */
export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-line bg-canvas/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12 lg:px-24"
      >
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-fg transition-colors duration-150 hover:text-accent"
        >
          DT<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative font-mono text-xs uppercase tracking-widest transition-colors duration-150 ${
                    isActive ? "text-fg" : "text-fg-secondary hover:text-fg"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="hidden border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent md:inline-block"
        >
          Email
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center border border-line-strong text-fg md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span
              className={`block h-px w-5 bg-current transition-transform duration-200 ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-transform duration-200 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-canvas md:hidden">
          <ul className="flex flex-col px-6 py-2">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-surface last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-mono text-sm uppercase tracking-widest text-fg-secondary transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
