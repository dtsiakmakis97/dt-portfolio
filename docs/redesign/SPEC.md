# Bold typographic redesign + per-project case studies

> **Status:** approved design spec, 2026-09-26. Source of truth for the redesign on
> `feat/redesign-typographic`. Task-level implementation plans are working documents
> kept outside the repo. The measured pre-redesign baseline is in
> `docs/redesign/baseline.json`. When the redesign ships, DESIGN.md and PRODUCT.md are
> rewritten from this spec (Phase 6) and this file becomes a historical record.

## Context

The portfolio (dtsiakmakis.dev) currently reads "quietly impressive": dark graphite, Cabinet Grotesk with mono body text, an electric-blue accent, a three.js node-network hero, and logbook work rows. The user wants a **complete redesign that is bold**: smooth transitions and animations, typography as the main visual, not boring. They also want **a dedicated page per project** with detailed case studies. The reference is the Refero style "monopo saigon" (`docs/redesign/references/monopo-saigon.md`, style `76c30104-1a19-42e7-a585-19505882f600`).

Research also found **four claims on the live site that are wrong or stale**. Under the "honest by default" brand they get corrected as part of this work:
- **Aegeon:** "Stripe deposit checkout". Since 2026-07-09 bookings are request-based and Stripe is switched off.
- **Lead Finder:** "four parallel LLM analyzers". A placeholder check short-circuits first, then technical, screenshot and content run in parallel. Only visual and content call Gemini.
- **PawGuard:** "two independent audits" were run by its own subagents, and the app has not launched (the pilot is waiting on GDPR sign-off).
- **T.E.:** "WCAG AA throughout" was a target, never audited.

Work continues on a new branch, `feat/redesign-typographic`, cut from `feat/work-ego-kryora`, which holds the unpushed Ego Distillers and Kryora commit `5f8e626`.

## Decisions (locked with the user)

| Topic | Decision |
|---|---|
| Direction | monopo's **energy, not its palette**: monumental editorial type, text-dominant, slow gliding motion, full pills against 0px corners, a rotating circular badge, a single-column work list. **Dark canvas**, with blue and light bands. |
| "Lots of text" | **Typography is the visual.** Home copy stays about as long as today; long-form lives on the project pages. |
| Voice | **Loud form, honest words.** PRODUCT.md changes from "Precise. Understated. Honest." to **"Precise. Bold. Honest."** No invented metrics. WCAG 2.2 AA still applies. |
| Color | **Electric blue `#3b9dff`, used loudly:** full-bleed blue bands, giant blue words, the page-transition curtain. |
| Motion | **GSAP** (ScrollTrigger, SplitText) + `@gsap/react` + **Lenis**. Page transitions use React `<ViewTransition>`. The three.js hero is removed. |
| Type | **Cabinet Grotesk, unleashed:** the variable 100–900 version at monumental sizes, 300 vs 800 weight contrast. Plex Mono only for small labels; body copy in Cabinet 400. |
| Tooling | Install Refero's `refero-design` skill in Phase 0. Use impeccable for critique and audit passes. |
| T.E. image | **Recapture without the people photo.** This replaces the current home screenshot too. |
| Kryora | **Full case study, noindexed, left out of the sitemap, no link to the preview, imagery credited** ("Imagery: kryora.de (AI renders)"). No new captures until the client signs off. |

## Design ledger (goes into the spec doc)

- **Primary reference:** monopo saigon. Keep: line-height ~0.8 statement blocks, 0.8–1.25s `cubic-bezier(0.19,1,0.22,1)` glide (the same curve as GSAP `expo.out`), pill-or-zero corners, the circular badge, the single-column work list.
- **Borrowed:**
  - Dennis Snellenberg (`434f44a8…`): cursor-following preview on the work list, curtain page transition.
  - Exo Ape (`83f0586f…`): tight leading and tracking at huge sizes.
  - K72 (`6b6d1ab7…`): weight 300 at huge sizes, sparse accent.
  - Bpowell (`d54fc794…`): a work index of giant stacked title links, color bands.
  - Linear–Brex (`4026b960…`) and Aristide Benoist (`14f39897…`): case-study structure and the meta strip.
- **Rejected:**
  - iridescent or WebGL media, and the light theme;
  - motion that plays on its own (WCAG 2.2.2), so the marquee and badge move **only with scroll**;
  - replacing the system cursor;
  - preloaders or intro screens;
  - scroll-jacking and ScrollTrigger pinning (use CSS `sticky`);
  - small images set inside the type lines.

## Information architecture

### Home `/`
Section ids and nav order stay the same. Two bright bands are never adjacent.

1. **Hero** (`#top`, dark)
   - Mono availability kicker.
   - The h1 as a statement block, about 10vw at line-height 0.82: "I build web products end to end," in weight 300, then "and the AI systems inside them." in weight 800, with "AI systems" in blue.
   - Subhead, then pills: blue "Get in touch" and a ghost "Résumé (PDF)".
   - **RotatingBadge** ("Selected work ·", scrolls to `#work`).
   - **FactLedger folded in** as a 4-cell mono meta strip.
2. **Manifesto** (`#about`, dark): a **ScrollFillText** statement built from the existing About copy (words fill from dim to ink as you scroll), then two corrected About paragraphs and a Languages/Availability `dl`.
3. **Work index** (`#work`, dark)
   - "Selected work (07)", then 7 **giant stacked full-width title links**: mono index, title fitted to the width, tagline · status.
   - Desktop only: a **cursor-following 16:10 preview**, which also becomes the image that morphs into the detail page.
   - Mobile shows type only. The long descriptions move to the detail pages.
4. **Experience** (`#experience`, dark): a "Three years at KPS AG" statement, then the four clients as large type rows with a highlight each.
5. **Stack** (`#stack`, **blue band**): a scroll-linked **VelocityMarquee** (`aria-hidden`, decorative) over the real content, a static 6-group skills list, in near-black ink.
6. **Contact** (`#contact`, dark): "Let's talk." at 18–22vw, a magnetic round blue mailto CTA, CopyEmail, socials, and the **existing ContactForm restyled**. Its logic, ids, labels, honeypot and "Send message" text stay the same.
7. **Footer:** a full-width wordmark, links, a résumé pill, "© 2026 · Built to the standard it claims · WCAG 2.2 AA".

**Removed:** the bg-grid, InstrumentLayer, ScrollProgress, the WebGL hero, the Eyebrow badge (replaced by a mono `Label`), and the stack chips.

### Case study `/work/[slug]`
1. Mono crumb, "Case study 01/07 · 2026", plus "← All work" back to `/#work`.
2. **h1: the project title fitted to the width.** It shares a view-transition name with the home row title. Then the tagline in weight 300.
3. **Hero media**: 16:10, the second shared element (with the cursor preview), loaded eagerly. With no image (Career Ops) it becomes a **blue typographic hero** with a near-black mono note.
4. Large lead paragraph, then a **meta strip** (Role / Year / Status / Stack / public Links only).
5. Typed sections:
   - **Context**, **Problem**;
   - **Approach**: a numbered `<ol>` of decisions, each with a bold one-line `h3`;
   - **Challenges**, **Outcome**.
   Layout is a mono label in columns 1–3 and the body in columns 4–10, max 62ch.
6. **Statement bands**, alternating blue and paper, never adjacent. They are **verified facts** set as `<p>`, never presented as quotes.
7. Captioned `<figure>`s (credit where needed), then a giant **"Next: <Project>"** link (curtain transition only, no shared name) plus "All work".

**`app/not-found.tsx`:** a huge "404", a pill home, and the project list.

## Architecture

### Delete
- `components/hero/{HeroBackground,HeroNetwork}.tsx`
- `components/chrome/{InstrumentLayer,ScrollProgress}.tsx`
- `components/credibility/FactLedger.tsx`
- `components/work/{SelectedWork,WorkEntry,WorkMedia}.tsx`
- `components/ui/{CtaCluster,Eyebrow,Reveal}.tsx`
- `lib/hooks/useParallax.ts`
- In `lib/content.ts`: `ctas`, `Cta`, `CtaKind`.
- In `components/ui/icons.tsx`: `FileText` (grep first; `ArrowDownRight` too if unused).
- The static Cabinet woff2 files.
- Dependencies: `three`, `@react-three/fiber`, `@types/three`, `geist`.

### Keep
- **Unchanged:** `app/actions/contact.ts`, `lib/schemas/contact.ts`, `lib/site.ts`, `components/ui/{CopyEmail,Magnetic}.tsx`, `lib/hooks/useMagnetic.ts`, `app/robots.ts`, `app/twitter-image.tsx`.
- **Restyle only:** `components/contact/ContactForm.tsx`.
- **Home only:** `lib/hooks/useActiveSection.ts`.

### New or rewritten
Server components by default; **(c)** marks client components.

- **`lib/gsap.ts` (c):** registers `useGSAP, ScrollTrigger, SplitText` once, sets `gsap.defaults({ ease: "expo.out", duration: 1.1 })` and `ScrollTrigger.config({ ignoreMobileResize: true })`, and re-exports all four.
- **Small helpers:**
  - `lib/vt.ts`: `vtTitle(slug)`, `vtMedia(slug)`, `NAV_FORWARD`, `NAV_BACK`. It is the only source of transition names, because a duplicate name aborts the whole transition.
  - `lib/tokens.ts`: `cssVar()`, since GSAP can't tween `var()`.
  - `lib/metadata.ts`: `baseOpenGraph`.
  - `lib/og/render.tsx`: shared OG layout. Fonts are static OTF/TTF files in `assets/og/`, read with `fs`, because satori can't read woff2 or variable fonts. This also removes the build's Google Fonts fetch.
- **`components/motion/`:**
  - `SmoothScroll` (c): Lenis on the GSAP ticker, a reduced-motion gate, and a sync on route change (snippet below).
  - `TransitionLink` (c): `next/link` plus `transitionTypes`, with `onNavigate` killing Lenis inertia.
  - `SplitReveal` (c), `ScrollFillText` (c).
  - `VelocityMarquee` (c) and `RotatingBadge` (c): both scroll-linked only.
  - `Reveal` (c): uses `gsap.from`, so the server-rendered markup is never hidden.
- **Sections:**
  - `hero/{Hero,HeroHeadline}`: the h1 words are split on the server and animated with **CSS only**, so the largest paint never waits on JS.
  - `about/About`.
  - `work/{WorkIndex,WorkRow}`: server components.
  - `work/WorkIndexInteractive` (c): pointer delegation over the server-rendered rows plus the cursor preview.
  - Rewrites of `experience/Experience`, `skills/Skills`, `contact/Contact`.
- **Chrome:**
  - `chrome/TopBar` (c): `/#section` links through `next/link`. On `/` it intercepts the click and scrolls with Lenis, then focuses the section. The header is pinned during view transitions.
  - `chrome/MobileMenu` (c): a native `<dialog>` with `data-lenis-prevent` and `lenis.stop()` while open.
  - `chrome/SiteFooter`.
- **`components/case-study/`:** `CaseHero`, `MetaStrip`, `CaseSections` (switches on `kind`), `ProseSection`, `Decisions`, `StatementBand`, `CaseFigure`, `NextProject`.
- **`components/ui/`:** `PillLink` (blue or ghost), `Label` (mono).
- **Routes:** `app/work/[slug]/{page,opengraph-image,twitter-image}.tsx`, `app/not-found.tsx`.
- **Styles:** `app/styles/{motion,view-transitions}.css`, imported from `globals.css`.
- **Typing:** `types/react-canary.d.ts` (`/// <reference types="react/canary" />`), needed for `ViewTransition` typings.

### Motion system rules
- **Client boundaries only at the leaves.** Pages, sections, rows and the case-study template stay server components.
- **Reduced motion, at every layer:**
  1. CSS makes the hero words, marquee and badge static.
  2. All GSAP runs inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
  3. Lenis isn't mounted.
  4. View-transition pseudo-elements get 0s durations.
  5. Magnetic and CursorPreview also require `(pointer: fine)`.
  6. Live toggling works.
- **Progressive enhancement:**
  - An inline `<head>` script adds `.js` to `<html>` (with `suppressHydrationWarning`).
  - CSS hides only `.js [data-reveal="load"]`, and a **2.5s failsafe keyframe** reveals it even if the JS bundle never loads.
  - Scroll reveals are never hidden in CSS.
  - Under reduced motion, everything is visible.
- **SplitText:**
  - Only below the fold. Headings use `aria: "auto"`; paragraphs get an sr-only copy plus a visual copy with `aria: "none"`.
  - Static string children only, keyed by the text, with `revertOnUpdate`.
  - A `played` guard stops resize re-splits from replaying the animation.
  - Line masks get `padding-block: .1em; margin-block: -.1em` so line-height 0.8 doesn't clip glyphs.
- **Scroll behavior:** drop the CSS `scroll-behavior: smooth`, since Lenis owns smooth scrolling. That also avoids the Next 16 `data-scroll-behavior` change.

```tsx
// components/motion/SmoothScroll.tsx: core (rendered once in app/layout.tsx; import lenis/dist/lenis.css)
useLenis(ScrollTrigger.update);
useEffect(() => { if (reduced) return;
  const tick = (t: number) => ref.current?.lenis?.raf(t * 1000);
  gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); };
}, [reduced]);
useEffect(() => { const id = requestAnimationFrame(() => {        // on every route change
  const l = ref.current?.lenis; l?.resize(); l?.scrollTo(window.scrollY, { immediate: true, force: true });
  ScrollTrigger.refresh(); }); return () => cancelAnimationFrame(id); }, [pathname]);
return reduced ? null : <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.08, syncTouch: false }} />;
```

### Routing and metadata
- **Static params:** `dynamicParams = false` and `generateStaticParams()` over `projects`. Use `PageProps<"/work/[slug]">` and `await params`, and call `notFound()` for unknown slugs.
- **`generateMetadata` must override the metadata inherited from the root layout,** because Next merges metadata shallowly:
  - `alternates.canonical: /work/${slug}`;
  - a full `openGraph: { ...baseOpenGraph, type: "article", url, title, description: summary }`;
  - `twitter`;
  - `robots: { index: false, follow: true }` when `noindex` is set (Kryora).
- **Root layout:** `title: { default, template: "%s · Dimitrios Tsiakmakis" }`, `themeColor: #0b0b0c`.
- **OG images:** per-slug `opengraph-image` plus a `twitter-image` re-export. The root OG image is redesigned to match.
- **Sitemap and nav:**
  - The sitemap adds `/work/${slug}` for every project except the noindexed ones.
  - `nav` hrefs become `/#about` etc.
  - On `/work/*`, "Work" gets `aria-current`.
- **`package.json`:** `typecheck` becomes `next typegen && tsc --noEmit`, because `PageProps` needs the generated route types on a clean checkout.

### View transitions
- **Setup:** `next.config.ts` sets `experimental: { viewTransition: true }`.
- **Shared elements, only two:** row title ↔ detail h1 (`vtTitle`), and cursor preview ↔ detail hero media (`vtMedia`). Both use `share="morph"` with `enter`/`exit`/`default` set to `"none"`.
- **Clean title morph:** the row title and the h1 use the **same fit rule**, `min(var(--fit-max), 100cqi / (var(--chars) * var(--fit-k)))`, in containers of the same width. The morph is then close to a pure translate. `--fit-k` gets tuned at Checkpoint A.
- **Blue curtain on the root snapshot, only when a transition type is active:**
  - Untyped transitions (the form action, the browser's back button) default to `animation: none`, so they swap instantly.
  - `nav-forward` animates the old snapshot's clip upward over a `--color-blue` group background, then reveals the new one. `nav-back` mirrors it.
  - The old and new snapshots need `mix-blend-mode: normal`, or the overlap renders too bright.
  - The header is pinned (`site-header`, `animation: none`).
  - Reduced motion sets all durations to 0s.
- **Working with GSAP:**
  - Shared elements get no GSAP entrance; the morph is their entrance.
  - Other load reveals on the detail page are delayed about 0.5s, so they play under the lifting curtain.
- **Fallback:** where the browser doesn't support this, navigation is an instant, correct swap. Phase 4 opens with a spike to check that the curtain background actually paints. If it doesn't, the fallback is a fixed `.vt-curtain` element with its own `view-transition-name`.

## Content model and accuracy

- **`lib/content.ts`** stays the source for short, ordered, home-level data. `Project` becomes `{ slug: ProjectSlug; name; tagline; summary (≤160 chars, corrected); role; period; status; stack; links?; cover?: Figure; noindex?: boolean }`.
  - `id` becomes `slug`, and `image`/`imageAlt` become `cover` with its intrinsic size.
  - The long `description` moves out.
  - `summary` feeds the meta description, the OG/Twitter text and the OG image.
- **`lib/work/types.ts`:**
  - `PROJECT_SLUGS` as a const tuple.
  - `Figure { src, width, height, alt, caption?, credit? }`.
  - `Decision { summary, body }`.
  - `CaseBlock` as a union of `prose | decisions | statement | figure`.
  - `CaseStudy { lead, hero?, blocks }`.
- **`lib/work/index.ts`:** `caseStudies` declared `satisfies Record<ProjectSlug, CaseStudy>` (so a missing case study is a compile error), plus `findProject`, `isProjectSlug`, `getNextProject` (wraps around).
- **`lib/work/<slug>.ts` × 7:** a header comment lists the **sources** (`~/Documents/Claude/wiki/wiki/projects/*.md`, session notes, repo docs) and that project's **must-not-say list**, the same way `content.ts` does now.
- **Length:** 600–1000 words for PawGuard, Lead Finder, Aegeon, Ego Distillers and Kryora. Career Ops and T.E. are shorter.
- **Corrections in Phase 1:**
  - Everywhere: the four claims listed in Context.
  - `facts`: "Multi-agent AI, shipped solo" gets reworded.
  - About paragraph 2: "PawGuard is a multi-agent development system running in production" gets reworded.
  - Aegeon: "Live" means the vercel.app URL, not aegeon.net.
- **Must-not-say, per project:**
  - **All projects:** no client PII (names, emails, phones), no owner portraits.
  - **Aegeon:** its visual system came from the owner's Claude Design handoffs, so don't claim it as original visual design.
  - **Lead Finder:** the v2 CSS was ported from a Claude Design handoff; the outreach email is a mock; no real lead data.
  - **Ego Distillers:** the earlier Emergent.sh prototype isn't the user's work; no legal name, no audit score as an outcome.
  - **Career Ops:** fork of santifer/career-ops (MIT), credited; only the dashboard is the user's; no job-search data.
  - **PawGuard:** no registry or Prosecutor integration claims (it's "eventual"); no NGO name, budget or Legal folder contents. How to phrase the Prosecutor's Office is reviewed at Checkpoint B.
  - **Kryora:** no ROI numbers or exclusivity claims; credit the imagery.
  - **T.E.:** the vercel.app URL isn't the official domain.
- **Content gate before merge:** grep `lib/` for `four parallel|Stripe deposit|two independent|independent audits|WCAG AA throughout|in production|Prosecutor|kryora\.de/|oikonomou\.vercel` and resolve every hit.
- **Screenshots:**
  - **T.E.:** recapture without the people photo (replaces the home one too).
  - **Aegeon:** recapture from the public site; the nav now says "Request booking".
  - **Captures in general:** 1280×960 (a 16:10 capture plus 80px edge-copied bands) where parallax needs the slack; WebP via `cwebp -q 80`/sharp.
  - **Lead Finder:** its cover shows the user's own username and email. Flag it at Checkpoint B.

## Tokens and fonts (`app/globals.css` `@theme`)

- **Colors** (contrast on `#0b0b0c`):

  | Token | Value | Contrast | Use |
  |---|---|---|---|
  | `canvas` | `#0b0b0c` | – | Page background |
  | `raised` | `#141415` | – | Raised surfaces |
  | `line` | `#2a2a2b` | – | Decorative only |
  | `line-strong` | `#6b6964` | 3.6:1 | Control borders (fixes today's 2:1 failure on inputs) |
  | `ink` / `paper` | `#f2f0ea` | 17.3:1 | Text; paper bands |
  | `ink-2` | `#a19e96` | 7.3:1 | Secondary text |
  | `ink-3` | `#8c8a84` | 5.7:1 | Mono labels |
  | `ink-dim` | `#6b6964` | 3.6:1 | **Text 24px and up only** |
  | `blue` | `#3b9dff` | 7.0:1 | Text on canvas only |
  | `danger` | `#f87171` | – | Errors |

- **Band rules:** blue and paper bands carry **canvas-colored ink only** (ink on blue is 2.5:1 and fails; blue on paper also fails). `--focus` and `::selection` invert inside bands.
- **Type:**

  | Token | Size | Line-height | Tracking | Used for |
  |---|---|---|---|---|
  | `mega` | `clamp(4.5rem,20vw,22rem)` | 0.8 | -0.05em | "Let's talk.", 404 |
  | `statement` | `clamp(3rem,10vw,12rem)` | 0.82 | -0.045em | Hero, manifesto, bands |
  | `fit` | `cqi` rule | – | – | Project titles |
  | `h2` | `clamp(2.25rem,5vw,5rem)` | 0.9 | – | Section headings |
  | `lead` | `clamp(1.5rem,1.1rem+1.4vw,2.25rem)` | 1.2 | – | Lead paragraphs |
  | `body` | `clamp(1.125rem,1rem+.3vw,1.25rem)` | 1.55 | – | Body copy, max 62ch |
  | `label` | `.75rem` | – | .14em | Mono caps |

- **Motion, radius, spacing:** `--ease-glide: cubic-bezier(0.19,1,0.22,1)`, `--dur-glide: 1.1s`; `--radius-pill: 9999px`, everything else 0; `--gutter: clamp(1.25rem,4vw,3.5rem)`; monumental type runs full-bleed inside the gutters.
- **Migration:** old token names stay as aliases through Phases 1–2 and are removed in Phase 3.
- **Fonts:**
  - Cabinet Grotesk **variable** woff2 from Fontshare (ITF Free Font License, committed with its license file) through `next/font/local`: `weight: "100 900"`, `preload: true`, `adjustFontFallback: "Arial"`. If the download has no variable file, fall back to static 300/400/800.
  - Plex Mono at 400 only, `preload: false`.

## Phases and checkpoints

Each phase ends with the gate `pnpm typecheck && pnpm build && pnpm test:e2e`. Commits happen at the end of each phase, **asking before each commit**.

**Phase 0: setup (no UI changes)**
1. Branch `feat/redesign-typographic` from `feat/work-ego-kryora`.
2. `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`.
3. Move the inspo note to `docs/redesign/references/monopo-saigon.md`.
4. Write `docs/redesign/SPEC.md` from this plan: the ledger, IA, token and contrast tables, motion rules, and the per-project fact and must-not-say sheet.
5. Invoke `superpowers:writing-plans` for a task-level plan of Phases 1–3.
6. Record a baseline: Lighthouse (mobile and desktop) on dtsiakmakis.dev and `pnpm next experimental-analyze` JS sizes.
7. Dependencies: `pnpm add gsap @gsap/react lenis`; `pnpm add -D @axe-core/playwright`; `pnpm remove three @react-three/fiber @types/three geist`.

**Phase 1: foundation and chrome**
- **Foundation:** tokens, the variable font, `lenis.css`, `lib/gsap.ts`, SmoothScroll, TransitionLink, the `.js` script plus failsafe CSS, the canary types, the `next.config.ts` flag, the typecheck script.
- **Content:** the model refactor (`slug`/`cover`/`summary`) plus **all copy corrections**.
- **Cleanup:** delete the dead and old chrome.
- **Chrome:** rewrite TopBar, MobileMenu and SiteFooter; update the e2e nav hrefs.

**Phase 2: hero and manifesto → CHECKPOINT A (user review)**
- **Build:** HeroHeadline (CSS words), RotatingBadge, the pills with Magnetic, the fact strip, SplitReveal, ScrollFillText.
- **Deliver:**
  - screenshots at 390, 768 and 1440, plus reduced-motion and no-JS versions;
  - a Playwright recording of the load and the scroll;
  - an impeccable `critique` pass.
- **Tune:** `--fit-k`, Lenis `lerp`, and the statement size.
- **Stop for sign-off.**

**Phase 3: rest of home**
- WorkIndex with the cursor preview, Experience, the blue Stack band (marquee plus list), Contact (mega heading, round CTA, restyled form), the footer.
- Remove the alias tokens.
- Gate adds a clean axe run on `/` and a keyboard walkthrough.

**Phase 4: detail route, transitions and PawGuard → CHECKPOINT B**
1. Start with the view-transition spike: curtain, blend mode, title and media morphs, Lenis sync, in Chrome, Safari and Firefox.
2. Build `app/work/[slug]/*`, the `case-study/*` template, `lib/work/{types,index,pawguard}.ts`, not-found, sitemap, OG images and metadata overrides.
3. **Deliver:** the same review set as Checkpoint A, plus recordings of home→detail, detail→next, detail→home, and the browser Back button.
4. **The user reviews the PawGuard copy for accuracy.**

**Phase 5: the remaining six case studies**
- **Order:** Lead Finder, Aegeon, Ego Distillers, Kryora (noindex, credited), then Career Ops and T.E.
- **Per project:**
  1. Read the wiki page, sessions and repo docs.
  2. Write the fact sheet in the module header.
  3. Draft the blocks.
  4. Run the must-not-say grep.
  5. Get **user sign-off per case study**.
- **Recaptures:** T.E. (no people photo) and Aegeon.

**Phase 6: docs and verification**
- **PRODUCT.md:** "Precise. Bold. Honest.", and principle 5 becomes **"Loud form, honest words"**: expression lives in type and motion, never in adjectives or numbers.
- **DESIGN.md:** full rewrite with named rules:
  - Blue-Band Ink
  - Blue-Only-On-Dark
  - Pill-or-Zero
  - Ink-Dim-Large-Only
  - Scroll-Linked-Never-Autonomous
  - LCP-Text-Never-Waits-On-JS
  - One-Monument-Per-Viewport
- **Other docs:** update the impeccable block in `AGENTS.md`, update the `README.md` stack and routes, regenerate `.impeccable/design.json`.
- **Verification:** impeccable `audit`, then the full verification below.
- **Wrap-up:** optionally log it in the wiki via `/save`. The PR opens only after asking.

## Verification

- **Always:** `pnpm typecheck` (with typegen), `pnpm build`, `pnpm test:e2e`. In `playwright.config.ts`, `E2E_PROD=1` switches the web server to `pnpm build && pnpm start` for the final run.
- **E2E suites:**
  - `e2e/smoke.spec.ts`:
    - h1 name `/AI systems inside them/i`;
    - nav hrefs `/#about … /#contact`, checked on `/` **and** `/work/pawguard`;
    - the contact validation test unchanged.
  - `e2e/work.spec.ts`:
    - each of the 7 slugs returns 200, its h1 is the project name, and "Next" points to the next slug;
    - `/work/does-not-exist` returns 404;
    - keyboard: Tab through the 7 rows in order, Enter, land on `/work/pawguard`.
  - `e2e/motion.spec.ts`:
    - with `reducedMotion: "reduce"`, all headings and reveals are visible, there is no `lenis` class and the marquee is static;
    - with `javaScriptEnabled: false`, the hero, the work links and a full case study are visible.
  - `e2e/a11y.spec.ts`: `@axe-core/playwright` with WCAG 2.2 AA tags on `/`, all 7 case studies and the 404, run under reduced motion so the bands are checked in their final state.
  - A second Playwright project, `mobile-chromium` (Pixel 7), for the dialog menu.
- **Performance** (budget measured against the Phase 0 baseline):
  - JS on `/` at most about 60KB gzipped above baseline. Expect about 50KB: gsap 27, ScrollTrigger 11, SplitText 6, Lenis 5, @gsap/react 1. Desktop should net smaller once three.js is gone.
  - Mobile Lighthouse: Performance ≥ 90, Accessibility 100, SEO 100, LCP ≤ 2.5s, **CLS ≤ 0.05** (the main risk with 20vw type), TBT ≤ 200ms.
  - A scroll test at 4× CPU throttle.
- **Visual:** 390, 768 and 1440 of `/` and `/work/pawguard` in normal, reduced-motion and no-JS modes, saved to `test-results/shots/` (gitignored), plus a manual pass of browser Back/Forward and hash links through Lenis.

## Key risks and how they're handled

| Risk | Mitigation |
|---|---|
| `experimental.viewTransition` is experimental | The feature is purely additive. Names are centralized, the spike comes first, the fallback curtain element is ready, and no test depends on transitions. |
| SplitText vs. hydration | Split after hydration, static strings only, and SplitText never touches the hero's largest-paint text. |
| Lenis vs. view transitions vs. scroll restoration | `onNavigate` kills inertia, the route-change sync takes the native scroll position, there's no pinning, and Back is tested by hand. |
| Font-swap layout shift on 20vw type | Preloaded variable font, `adjustFontFallback`, CLS measured; fall back to `display: "optional"` if CLS exceeds 0.05. |
| Contrast on the bands | Band-scoped ink tokens, and axe on every page. |
| Content accuracy | Source headers per module, the grep gate, user sign-off per case study. |

## Out of scope and follow-ups

- **`public/resume.pdf`** still lists Edu Resource Pipeline. It's regenerated outside this repo.
- **The `feat/work-ego-kryora` commit** ships inside the redesign PR unless the user merges it to `main` first.
- **Live-site fixes are not hot-fixed.** The four copy errors and the T.E. screenshot are corrected in Phase 1 and Phase 5 on the branch; they go live when the redesign merges.
