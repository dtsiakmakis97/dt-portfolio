import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** GSAP with its plugins and house defaults. Load it only through
 *  loadMotion() (lib/motion/load.ts), never statically: e2e/foundation.spec.ts
 *  enforces that. expo.out is the CSS token --ease-glide. */
gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "expo.out", duration: 1.1 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText };
