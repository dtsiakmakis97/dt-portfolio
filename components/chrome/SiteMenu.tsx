"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import { profile } from "@/lib/content";
import type { MenuRow } from "@/lib/menu";
import { SectionLink } from "@/components/motion/SectionLink";
import { pill } from "@/components/ui/pill";

/** One row's band: its facts, twice over so the run loops, split by the
 *  logo's square period (Work's by its project covers). Decorative: the link's
 *  name stays the section's. */
function Band({ facts }: { facts: MenuRow["facts"] }) {
  const run = (copy: number) => (
    // The label size is set on the run, so the covers and squares scale with the words.
    <span key={copy} className="menu-label flex items-center font-extrabold">
      {facts.map(({ text, cover }) => {
        return (
          <Fragment key={text}>
            <span className="whitespace-nowrap px-[0.3em]">{text}</span>
            {cover ? (
              // Plain <img> on the optimizer's srcset (lib/menu.ts): no next/image client component.
              <img {...cover} alt="" loading="lazy" decoding="async" className="h-[0.72em] w-[1.9em] rounded-pill object-cover" />
            ) : (
              <span className="size-[0.16em] shrink-0 bg-canvas" />
            )}
          </Fragment>
        );
      })}
    </span>
  );
  return (
    <span data-band="" aria-hidden="true" className="menu-band">
      <span data-track="" className="menu-track">
        {run(0)}
        {run(1)}
      </span>
    </span>
  );
}

/** The site menu: a full-screen native <dialog> (the browser handles modality,
 *  the focus trap, Escape and focus return; Lenis pauses while it is open).
 *  Its pill is the header's only navigation on a phone, and on wider screens
 *  once the header has collapsed past the hero. */
export function SiteMenu({ collapsed, rows }: { collapsed: boolean; rows: readonly MenuRow[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => lenis?.start();
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [lenis]);

  const open = () => {
    lenis?.stop();
    dialog.current?.showModal();
  };
  const close = () => {
    dialog.current?.close();
    lenis?.start(); // before a link asks Lenis to scroll
  };

  return (
    <>
      <button
        type="button"
        data-shelter=""
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="site-menu"
        className={`${collapsed ? "md:animate-[fade-rise_0.6s_var(--ease-glide)_both]" : "md:hidden"} ${pill("ghost")}`}
      >
        Menu
      </button>
      <dialog
        id="site-menu"
        ref={dialog}
        aria-label="Menu"
        data-lenis-prevent=""
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-canvas open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-gutter py-4">
          <span className="font-display text-xl font-extrabold tracking-tight">
            DT<span className="text-blue">.</span>
          </span>
          <button type="button" onClick={close} className={pill("ghost")}>
            Close
          </button>
        </div>
        <nav aria-label="Sections" className="flex flex-1 flex-col justify-center">
          <ul>
            {rows.map((item, i) => {
              return (
                <li key={item.href} className="border-t border-line last:border-b">
                  <SectionLink href={item.href} onClick={close} className="menu-row relative block overflow-hidden px-gutter">
                    <span className="word-clip">
                      <span className="word-rise menu-label font-extrabold" style={{ "--d": `${150 + i * 60}ms` } as CSSProperties}>
                        {item.label}
                      </span>
                    </span>
                    <Band facts={item.facts} />
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-wrap justify-between gap-4 px-gutter py-6 font-mono text-label uppercase text-ink-2">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-ink">
            {profile.email}
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
            Résumé (PDF)
          </a>
        </div>
      </dialog>
    </>
  );
}
