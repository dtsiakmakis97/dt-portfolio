# dt-portfolio

Personal portfolio for **Dimitrios Tsiakmakis** — a full-stack & AI engineer in
Berlin. The site is built to be a work sample in its own right: precise,
understated, accessible by default (WCAG 2.2 AA), and fast.

The strategic brief lives in [`PRODUCT.md`](./PRODUCT.md) (register, audience,
principles, anti-references) and the visual system in [`DESIGN.md`](./DESIGN.md)
(tokens, type, components). Read those before any design or UI change.

## Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**
- **Tailwind CSS v4** with design tokens defined in `app/globals.css` (`@theme`)
- **three.js** + **@react-three/fiber** for the desktop hero signal-network
  (lazy-loaded, gated to capable desktops, off under reduced motion)
- **Resend** + **Zod** for the contact form (a Server Action — no API routes)
- Self-hosted **Cabinet Grotesk** (display) + **IBM Plex Mono** (body/metadata)

## Architecture

Single-page site composed in `app/page.tsx`. Content is one typed source of
truth in `lib/content.ts` — there is no CMS. Components are grouped by surface
(`components/hero`, `components/work`, `components/chrome`, …) with reusable
primitives in `components/ui`. SEO/metadata is wired in `app/layout.tsx` with
`app/robots.ts`, `app/sitemap.ts`, and a generated OG card in
`app/opengraph-image.tsx`.

```
app/            routes, layout, metadata, contact Server Action
components/     UI grouped by surface area
lib/            content.ts (copy), hooks, schemas, site.ts (canonical URL)
public/         resume.pdf, /work screenshots
```

## Local development

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Secrets are managed in **Infisical** and synced to Vercel; the contact form
degrades gracefully when `RESEND_API_KEY` is absent (it validates and shows an
"email me directly" message instead of sending). To run the form end to end
locally, inject secrets at runtime:

```bash
infisical run --env=dev --domain=https://eu.infisical.com -- pnpm dev
```

### Environment variables

See [`.env.example`](./.env.example). Generate a template with
`infisical secrets generate-example-env`.

| Variable               | Required | Purpose                                                        |
| ---------------------- | -------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`       | prod     | Sends contact-form email via Resend. Absent → graceful notice. |
| `CONTACT_TO`           | optional | Recipient. Defaults to `profile.email`.                        |
| `CONTACT_FROM`         | optional | Verified-domain sender. Defaults to `onboarding@resend.dev`.   |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin for metadata/sitemap/OG. Falls back to the    |
|                        |          | Vercel production URL, then `localhost`.                       |

## Scripts

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
pnpm test:e2e     # Playwright smoke tests (hero, nav, contact validation)
```

## Deployment

Hosted on **Vercel**. `build` is left unwrapped so Vercel injects its own
build-time env (synced from Infisical). Production is the single source of truth
via the Infisical → Vercel sync; rotate a secret once in Infisical and both
local (`infisical run`) and Vercel pick it up.
