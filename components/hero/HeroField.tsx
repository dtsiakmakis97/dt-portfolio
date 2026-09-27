"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { afterLoad } from "@/lib/motion/load";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";
import type { Field, Shelter } from "./field";

const STORE_KEY = "hero-motion";
/** Where the still frame (reduced motion) sits in the field's drift. */
const STILL_TIME = 12;
/** Frame governor: median frame gaps (ms) past which the field draws at 1x,
 *  then settles into a still frame. A software WebGL renderer needs both. */
const SLOW_FRAME = 34;
const STALLED_FRAME = 50;
/** It decides after this many frames or a second of them, whichever is first,
 *  so a stalled renderer isn't left stuttering for long. */
const SAMPLE_FRAMES = 30;
const WARMUP_FRAMES = 5;
/** What the field keeps against every sheltered word: 4.5:1 (WCAG AA for body
 *  text) plus a margin for 8-bit rounding. */
const TARGET_CONTRAST = 4.8;
const TRANSPARENT = /^(transparent|rgba\(.*,\s*0\))$/;

const subscribeNever = () => () => {};

function storedPause(): boolean {
  try {
    return localStorage.getItem(STORE_KEY) === "paused";
  } catch {
    return false;
  }
}

function storePause(paused: boolean): void {
  try {
    localStorage.setItem(STORE_KEY, paused ? "paused" : "running");
  } catch {
    // Storage can be blocked; the toggle still works for this visit.
  }
}

type Rgb = [number, number, number];

function hexRgb(value: string): Rgb | null {
  const hex = value.trim().replace("#", "");
  const n = /^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(hex) ? Number.parseInt(hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex, 16) : Number.NaN;
  return Number.isNaN(n) ? null : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function cssColor(name: string, fallback: Rgb): Rgb {
  return hexRgb(getComputedStyle(document.documentElement).getPropertyValue(name)) ?? fallback;
}

function palette(): { canvas: Rgb; blue: Rgb; ink: Rgb } {
  return {
    canvas: cssColor("--color-canvas", [0.043, 0.043, 0.047]),
    blue: cssColor("--color-blue", [0.231, 0.616, 1]),
    ink: cssColor("--color-ink", [0.949, 0.941, 0.918]),
  };
}

/** WCAG relative luminance of 0-to-1 sRGB channels. */
function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** A computed "rgb(r, g, b)" as 0-to-1 channels. */
function computedRgb(value: string): Rgb | null {
  const [r, g, b] = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return b === undefined ? null : [r / 255, g / 255, b / 255];
}

/** Luminances of the Tailwind text colors on `node` in any state ("text-ink-3",
 *  "hover:text-blue"), read from their --color tokens, so a word measured
 *  while hovered still counts its resting color and the other way round. */
function utilityLuminances(node: Element, tokens: CSSStyleDeclaration): number[] {
  return (node.getAttribute("class") ?? "").split(/\s+/).flatMap((cls) => {
    const utility = cls.split(":").pop() ?? "";
    const rgb = utility.startsWith("text-") ? hexRgb(tokens.getPropertyValue(`--color-${utility.slice(5)}`)) : null;
    return rgb ? [luminance(rgb)] : [];
  });
}

/** The luminance the field may reach behind `el`: low enough that the dimmest
 *  color any text drawn straight on the field inside it can take keeps
 *  TARGET_CONTRAST, and never below the canvas itself. Text on its own opaque
 *  ground (the blue pill) doesn't count. */
function shelterCap(el: Element, ground: number): number {
  const tokens = getComputedStyle(document.documentElement);
  let dimmest = Number.POSITIVE_INFINITY;
  const visit = (node: Element, inherited: number) => {
    const style = getComputedStyle(node);
    if (!TRANSPARENT.test(style.backgroundColor)) return;
    const floor = Math.min(inherited, ...utilityLuminances(node, tokens));
    if ([...node.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())) {
      const rgb = computedRgb(node instanceof SVGElement ? style.fill : style.color);
      dimmest = Math.min(dimmest, floor, rgb ? luminance(rgb) : Number.POSITIVE_INFINITY);
    }
    for (const child of node.children) visit(child, floor);
  };
  visit(el, Number.POSITIVE_INFINITY);
  return dimmest === Number.POSITIVE_INFINITY ? 1 : Math.max(ground, (dimmest + 0.05) / TARGET_CONTRAST - 0.05);
}

/** The hero's lens field and its pause control (WCAG 2.2.2: the field
 *  drifts on its own). Loads after the page's load event, so the headline
 *  paints first. Under reduced motion it holds one still frame; without
 *  WebGL it renders nothing and the hero is as it was. Words marked
 *  data-shelter in the hero cap the field's luminance behind them. */
export function HeroField() {
  const client = useSyncExternalStore(subscribeNever, () => true, () => false);
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Field | null>(null);
  const clock = useRef(0);
  const dprCap = useRef<number | null>(null);
  const remeasure = useRef<() => void>(() => {});
  const [phase, setPhase] = useState<"waiting" | "ready" | "off">("waiting");
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [settled, setSettled] = useState(false);

  // Create the renderer once the page has loaded.
  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    afterLoad()
      .then(() => import("./field"))
      .then(({ createField }) => {
        if (cancelled || !canvas.current) return;
        engine.current = createField(canvas.current, palette());
        setPaused(storedPause());
        setPhase(engine.current ? "ready" : "off");
      })
      .catch(() => setPhase("off"));
    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [client]);

  // Size the drawing buffer to the hero and keep the shelter on the words.
  useEffect(() => {
    const field = engine.current;
    const section = canvas.current?.parentElement;
    if (phase !== "ready" || !field || !section) return;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const ground = luminance(palette().canvas);
    const measure = () => {
      const box = section.getBoundingClientRect();
      field.resize(box.width, box.height, Math.min(window.devicePixelRatio || 1, dprCap.current ?? (coarse ? 1.5 : 2)));
      // The hero's own words, plus the fixed header's, placed where the header
      // sits over the hero: at scroll 0 (past 24px it turns solid anyway).
      const shelters: Shelter[] = [...document.querySelectorAll("[data-shelter]")].flatMap((el) => {
        const r = el.getBoundingClientRect();
        const top = section.contains(el) ? r.top - box.top : r.top - (box.top + window.scrollY);
        if (r.width <= 0 || r.height <= 0 || top >= box.height || top + r.height <= 0) return [];
        return [{ x: r.left - box.left, y: top, width: r.width, height: r.height, cap: shelterCap(el, ground) }];
      });
      field.setShelter(shelters);
      field.render(clock.current);
    };
    remeasure.current = measure;
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    // The entrance and the webfont can still move the words after the first measure.
    void document.fonts?.ready.then(measure);
    void Promise.all(section.getAnimations({ subtree: true }).map((a) => a.finished)).then(measure, measure);
    return () => observer.disconnect();
  }, [phase]);

  // Drift, lean toward the pointer, and stop whenever the field can't be seen.
  useEffect(() => {
    const field = engine.current;
    const section = canvas.current?.parentElement;
    if (phase !== "ready" || !field || !section) return;
    if (reduced || settled) {
      if (reduced) clock.current = STILL_TIME;
      field.setPointer(0, 0, false);
      field.render(clock.current);
      setShown(true);
      return;
    }
    field.render(clock.current);
    setShown(true);
    if (paused) return;

    let raf = 0;
    let lastFrame: number | null = null;
    let onScreen = true;
    const gaps: number[] = [];
    let warmup = WARMUP_FRAMES;
    let sampleStart: number | null = null;
    const govern = (median: number) => {
      gaps.length = 0;
      sampleStart = null;
      warmup = WARMUP_FRAMES;
      if (median > SLOW_FRAME && dprCap.current === null && window.devicePixelRatio > 1) {
        dprCap.current = 1;
        remeasure.current();
      } else if (median > STALLED_FRAME) setSettled(true);
      else warmup = Number.POSITIVE_INFINITY;
    };
    const frame = (stamp: number) => {
      if (lastFrame !== null) {
        const gap = stamp - lastFrame;
        clock.current += Math.min(0.1, gap / 1000);
        if (warmup > 0) warmup -= 1;
        else {
          sampleStart ??= stamp;
          gaps.push(gap);
          if (gaps.length >= SAMPLE_FRAMES || (stamp - sampleStart > 1000 && gaps.length >= WARMUP_FRAMES)) {
            govern(gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)]);
          }
        }
      }
      lastFrame = stamp;
      field.render(clock.current);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && onScreen) {
        lastFrame = null;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    // Touch gets the idle drift only: a finger dragging the glass would fight the scroll.
    const onMove = (event: PointerEvent) => {
      const box = section.getBoundingClientRect();
      field.setPointer(event.clientX - box.left, event.clientY - box.top, event.pointerType !== "touch");
    };
    const onLeave = () => field.setPointer(0, 0, false);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visibility.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave, { passive: true });
    start();
    return () => {
      stop();
      visibility.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [phase, reduced, paused, settled]);

  if (!client || phase === "off") return null;
  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        data-hero-field=""
        className={`pointer-events-none absolute inset-0 -z-10 size-full transition-opacity duration-[1100ms] ease-glide motion-reduce:transition-none ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      {phase === "ready" && !reduced && !settled && (
        <button
          type="button"
          data-shelter=""
          onClick={() => {
            setPaused((was) => {
              storePause(!was);
              return !was;
            });
          }}
          className="absolute right-gutter top-24 min-h-6 font-mono text-label uppercase text-ink-3 transition-colors hover:text-ink"
        >
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </>
  );
}
