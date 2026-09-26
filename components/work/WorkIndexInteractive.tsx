"use client";

import { useEffect, useRef, useState, ViewTransition, type PointerEvent, type ReactNode } from "react";
import { useMotion } from "@/lib/motion/useMotion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { SHARE_ON_NAV, vtMedia } from "@/lib/vt";

interface Preview {
  readonly slug: string;
  readonly src: string;
}

const FINE_POINTER_MOTION = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Pointer layer over the server-rendered rows: a 16:10 preview follows the
 *  cursor and shows the hovered project. Desktop and motion-OK only; touch
 *  users get the type-only index. The preview carries the project's media
 *  view-transition name so it can morph into the case-study hero. */
export function WorkIndexInteractive({ previews, children }: { previews: readonly Preview[]; children: ReactNode }) {
  const enabled = useMediaQuery(FINE_POINTER_MOTION, false);
  const box = useRef<HTMLDivElement>(null);
  const follow = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // WCAG 1.4.13: hover content must be dismissable without moving the pointer.
  // Escape hides the current preview; a different row, or leaving the list,
  // brings it back.
  const [dismissed, setDismissed] = useState<string | null>(null);
  const shown = active !== dismissed ? active : null;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDismissed(active);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, active]);

  useMotion(
    ({ gsap }) => {
      if (!enabled || !box.current) return;
      gsap.set(box.current, { xPercent: -50, yPercent: -50 });
      follow.current = {
        x: gsap.quickTo(box.current, "x", { duration: 0.7, ease: "expo.out" }),
        y: gsap.quickTo(box.current, "y", { duration: 0.7, ease: "expo.out" }),
      };
      return () => {
        follow.current = null;
      };
    },
    { dependencies: [enabled] },
  );

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const slug = (event.target as Element).closest<HTMLElement>("[data-slug]")?.dataset.slug ?? null;
    setActive(slug && previews.some((p) => p.slug === slug) ? slug : null);
    follow.current?.x(event.clientX);
    follow.current?.y(event.clientY);
  };

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        setActive(null);
        setDismissed(null);
      }}
    >
      {children}
      {enabled && (
        <div
          ref={box}
          data-preview=""
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 w-[min(34vw,460px)]"
        >
          <ViewTransition name={shown ? vtMedia(shown) : undefined} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
            <div
              className={`relative aspect-[16/10] overflow-hidden transition-[opacity,scale] duration-500 ease-glide ${
                shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              {previews.map((p) => (
                <img
                  key={p.slug}
                  src={p.src}
                  alt=""
                  decoding="async"
                  fetchPriority="low"
                  data-active={p.slug === shown ? "" : undefined}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
                    p.slug === shown ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </ViewTransition>
        </div>
      )}
    </div>
  );
}
