import { pill } from "@/components/ui/pill";

/* "DT." as outlines: Cabinet Grotesk at weight 800 (the header logo's), shaped
   as one run with its kerning and tracking-tight, laid in a text-xl line box
   (1.4em, baseline at 0.995em), in units of 1/1000 em. Made once with fontkit
   from app/fonts/CabinetGrotesk-Variable.woff2 (the ITF license allows
   wordmarks and vector files, section 01). Outlines, not text: no fallback
   face flashes before the font loads, and inline SVG is never the LCP. */
const DT =
  "M325 995L104 995L104 868L313 868Q375 868 416 845Q456 821 476 775Q496 728 496 660Q496 591 476 545Q455 499 414 476Q373 452 311 452L104 452L104 325L323 325Q425 325 498 367Q570 409 608 484Q646 559 646 660Q646 760 608 836Q570 911 499 953Q427 995 325 995ZM197 995L54 995L54 325L197 325ZM957 995L814 995L814 325L957 325ZM1157 452L614 452L614 325L1157 325Z";
const DOT = "M1268 995L1116 995L1116 840L1268 840Z";

/** The first view of a session opens on a giant "DT." that flies into the
 *  header logo while the ground lifts off the page, which has been painted
 *  underneath all along (app/styles/intro.css). The <head> script in
 *  app/layout.tsx decides whether it plays and ends it, early on any click,
 *  key or wheel; this is only its markup. Without JavaScript it never starts. */
export function Intro() {
  return (
    <div data-intro="" aria-hidden="true" className="intro-layer">
      <div className="intro-ground" />
      {/* Laid out like the header row, so the mark's landing spot is the logo's. */}
      <div className="flex items-center justify-between px-gutter py-4">
        <span className="intro-slot">
          <svg data-intro-mark="" viewBox="0 0 1277 1400" className="intro-mark">
            <path className="intro-dt" d={DT} />
            <path className="intro-dot" d={DOT} />
          </svg>
        </span>
        <span className={`invisible ${pill("ghost")}`}>Menu</span>
      </div>
    </div>
  );
}
