# dt-portfolio

Personal portfolio for **Dimitrios Tsiakmakis**, a full-stack and AI engineer in
Berlin. The site is built to be a work sample in its own right: bold in form,
honest in its words, accessible by default (WCAG 2.2 AA) and fast.

The strategic brief lives in [`PRODUCT.md`](./PRODUCT.md) (register, audience,
principles, anti-references), the visual system in [`DESIGN.md`](./DESIGN.md)
(tokens, type, rules, components) and the redesign spec in
[`docs/redesign/SPEC.md`](./docs/redesign/SPEC.md). Read those before any design
or UI change.

## Stack

- **Next.js 16.2** (App Router, React Server Components) + **React 19.2**
- **Tailwind CSS v4** with design tokens in `app/globals.css` (`@theme`)
- **gsap 3.15** (ScrollTrigger, SplitText), loaded after the page's load event
  through `lib/motion/load.ts`, so no motion code sits on the first paint's
  critical path
- **lenis** for smooth scrolling, handed to the gsap ticker once motion loads
- **React `<ViewTransition>`** with `next/link` transition types for the page
  transitions: a blue curtain, and the title and media morphing between the work
  index and a case study (names in `lib/vt.ts`)
- **Resend** + **Zod** for the contact form (a Server Action, no API routes)
- Self-hosted **Cabinet Grotesk** variable (display and body) + **IBM Plex Mono**
  (labels only)

## Routes

| Route | What |
| --- | --- |
| `/` | Home: hero, manifesto, work index, experience, stack band, contact |
| `/work/[slug]` | One case study per project, statically generated; unknown slugs 404 |
| `/opengraph-image`, `/work/[slug]/opengraph-image` | Share cards (and their `twitter-image` twins), rendered from local font cuts in `assets/og` |
| `/sitemap.xml`, `/robots.txt` | Home and every indexable case study; Kryora is noindexed and left out |
| 404 | `app/not-found.tsx`, which lists the work |

## Architecture

Content is a typed source of truth, with no CMS: `lib/content.ts` holds the home
copy and the ordered project list, and `lib/work/<slug>.ts` holds one case study
per module, each with a header naming its sources and what it must not say.
Pages, sections and rows are server components; client components sit only at
the leaves (motion, the work-index preview, the menu, the form).

```
app/            routes, layout, metadata, share cards, contact Server Action
components/     UI grouped by surface (hero, work, case-study, motion, chrome, ...)
lib/            content, case studies, motion loader, view-transition names, OG renderer
assets/og/      static font cuts for the share cards
public/         resume.pdf, /work screenshots
e2e/            Playwright specs
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

## Scripts and tests

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # next typegen && tsc --noEmit
pnpm test:e2e     # Playwright against the dev server
E2E_PROD=1 pnpm test:e2e     # against a production build; also runs the performance budgets
SHOTS=1 pnpm exec playwright test e2e/shots.spec.ts --project=chromium
                  # review captures and transition recordings in test-results/shots
```

The suite includes the gates the copy has to pass: `e2e/content.spec.ts`
(retired claims, house style), `e2e/case-content.spec.ts` (word budgets,
structure and each project's must-not-say list), and an axe WCAG 2.2 AA check
on every route.

## Deployment

Hosted on **Vercel**. `build` is left unwrapped so Vercel injects its own
build-time env (synced from Infisical). Production is the single source of truth
via the Infisical → Vercel sync; rotate a secret once in Infisical and both
local (`infisical run`) and Vercel pick it up.
