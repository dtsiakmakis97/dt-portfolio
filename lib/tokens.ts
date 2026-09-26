/** A resolved CSS custom property from :root. GSAP interpolates concrete
 *  colors, not var() references. Client-only. Tokens are emitted by
 *  `@theme static` in app/globals.css. */
export function cssVar(name: `--${string}`): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
