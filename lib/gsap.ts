import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/** One place that registers GSAP plugins and house defaults. Import from
 *  client components only (every consumer is a "use client" leaf).
 *  expo.out is the same curve as the CSS token --ease-glide:
 *  cubic-bezier(0.19, 1, 0.22, 1). */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
