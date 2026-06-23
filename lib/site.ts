/**
 * Canonical site origin, resolved once for metadata, sitemap, robots and OG.
 *
 * Priority: an explicit `NEXT_PUBLIC_SITE_URL` (set it once a custom domain
 * exists) → Vercel's production domain, injected at build → localhost for dev.
 * No trailing slash, so callers can append paths directly.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  "http://localhost:3000";

export const siteUrl = fromEnv.replace(/\/+$/, "");
