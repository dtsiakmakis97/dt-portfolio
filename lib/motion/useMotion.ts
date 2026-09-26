import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { loadMotion, type Motion } from "./load";

interface UseMotionOptions {
  /** Scopes selector text in the setup to this element (gsap.context scope). */
  scope?: RefObject<Element | null>;
  dependencies?: DependencyList;
}

/** useGSAP's contract without a static GSAP import: the setup runs inside a
 *  gsap.context once motion has loaded, and the context (plus any cleanup the
 *  setup returns) is reverted on unmount or when dependencies change. */
export function useMotion(
  setup: (motion: Motion) => void | (() => void),
  { scope, dependencies = [] }: UseMotionOptions = {},
): void {
  const latest = useRef(setup);
  useLayoutEffect(() => {
    latest.current = setup;
  });

  useEffect(() => {
    let cancelled = false;
    let context: gsap.Context | undefined;
    loadMotion().then((motion) => {
      if (cancelled) return;
      context = motion.gsap.context(() => latest.current(motion), scope?.current ?? undefined);
    });
    return () => {
      cancelled = true;
      context?.revert();
    };
    // The caller owns the dependency list, as with useGSAP.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
