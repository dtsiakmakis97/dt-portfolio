"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { nav, profile } from "@/lib/content";
import { SectionLink } from "@/components/motion/SectionLink";
import { pill } from "@/components/ui/pill";

/** Full-screen native <dialog>: the browser handles modality, the focus trap,
 *  Escape and focus return. Lenis pauses while it is open. */
export function MobileMenu() {
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
        aria-controls="mobile-menu"
        className={`md:hidden ${pill("ghost")}`}
      >
        Menu
      </button>
      <dialog
        id="mobile-menu"
        ref={dialog}
        aria-label="Menu"
        data-lenis-prevent=""
        className="m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-canvas open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-gutter py-4">
          <span className="font-display text-xl font-extrabold">
            DT<span className="text-blue">.</span>
          </span>
          <button type="button" onClick={close} className={pill("ghost")}>
            Close
          </button>
        </div>
        <nav aria-label="Sections" className="flex flex-1 flex-col justify-center px-gutter">
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="border-t border-line last:border-b">
                <SectionLink
                  href={item.href}
                  onClick={close}
                  className="block py-4 font-display text-h2 font-extrabold transition-colors duration-300 hover:text-blue"
                >
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>
        <a href={`mailto:${profile.email}`} className="px-gutter pb-8 font-mono text-label uppercase text-ink-2">
          {profile.email}
        </a>
      </dialog>
    </>
  );
}
