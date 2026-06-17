---
name: Dimitrios Tsiakmakis — Portfolio
description: A dark editorial portfolio with devtools precision; an engineer's logbook.
colors:
  canvas: "#0a0a0a"
  panel: "#0d0d0d"
  surface: "#171717"
  elevated: "#1f1f1f"
  line: "#262626"
  line-strong: "#404040"
  fg: "#f5f5f5"
  fg-secondary: "#a3a3a3"
  fg-muted: "#8a8a8a"
  ember: "#f59e0b"
  ember-hi: "#fbbf24"
typography:
  display:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1rem + 8vw, 6.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 3vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.25em"
rounded:
  md: "0px"
  xl: "0px"
  full: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "40px"
  section: "clamp(5rem, 4rem + 5vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg-secondary}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-icon:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg-secondary}"
    rounded: "{rounded.md}"
    size: "36px"
  chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg-muted}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
---

# Design System: Dimitrios Tsiakmakis — Portfolio

> **2026-06-17 — Bold neo-brutalist re-skin (authoritative).** The site was rebuilt to match a new reference design. Where the detailed sections below (the prior "Engineer's Logbook" direction) conflict with this note, **this note wins**; the frontmatter tokens above are current.
>
> **Changed:** Type is now **Cabinet Grotesk** (display/headings, self-hosted via `next/font/local`) + **IBM Plex Mono** (body *and* metadata — body is mono now), replacing Geist. Palette is **true-neutral** graphite (`#0a0a0a → #0d0d0d → #171717`, hairline `#262626`) with a saturated **signal amber `#F59E0B`** (was peach `#e9a86a`); `fg-muted` held at `#8a8a8a` to clear WCAG AA. **All corners are sharp (`rounded-none`).** The **primary button is a white fill** with dark text, warming to amber on hover. Sections carry mono indices (`[01]`–`[05]`) and a fact-ledger strip sits under the hero.
>
> **Preserved:** dark canvas, single semantic amber, mono-for-metadata, depth via tonal surfaces + 1px hairlines (no shadows), work as logbook rows (not cards), WCAG 2.2 AA, full `prefers-reduced-motion` support.
>
> **New motion / surfaces:** a lazy WebGL node-network behind the hero (three.js + react-three-fiber, reduced-motion/offscreen-guarded), a drifting technical grid, a scroll-progress bar, active-section nav, and a word-by-word hero headline reveal. Selected Work shows **real grayscale screenshots** for live projects (Aegeon, T.E. Learning Center) and a typographic spec-panel for the rest. Contact is a working form (Server Action + Zod + honeypot + Resend).
>
> `.impeccable/design.json` is a generated artifact and is now **stale** — regenerate it from this file on the next impeccable run.

## 1. Overview

**Creative North Star: "The Engineer's Logbook"**

This is a precise, honest record, not a brochure. The interface reads like the workspace of the engineer it represents: a dark graphite canvas, structure drawn in hairlines instead of boxes, and a single warm signal that appears only where it means something. Metadata (roles, dates, status, stack, the email) is set in monospace and reads like log entries; project work is numbered and listed, not packaged into glossy cards. Nothing is embellished, because the brand's core asset is credibility and embellishment spends it.

The personality is **precise, understated, and honest**. Density is editorial: generous vertical breathing room, a single centered column capped at a comfortable measure, large display type for the few statements that matter and quiet monospace for everything that supports them. The emotional target is **quietly impressive**: the design earns trust by not trying too hard, and the proof of craft is that every detail holds up under inspection (because the people reading this screen-by-screen are exactly the people who inspect details).

This system explicitly rejects the **generic developer-portfolio template** (hero plus animated skill bars plus a uniform grid of identical project cards plus a decorative gradient blob) and the **corporate SaaS landing page** (cream or pastel backgrounds, soft rounded cards, gentle gradients, the big-number hero-metric template). Both look like everyone else and perform confidence instead of earning it.

**Key Characteristics:**
- Dark graphite canvas with stepped tonal surfaces; depth comes from layering and hairlines, never shadows.
- One warm accent (Ember), held to a tiny footprint and always semantic.
- A strict Sans-for-prose / Mono-for-metadata split that does the work of an information hierarchy.
- Editorial type scale: a few very large statements, everything else quiet.
- Work presented as numbered logbook rows, not cards.
- Motion is restraint plus one soft reveal; everything collapses cleanly under reduced-motion.

## 2. Colors: The Ember-on-Graphite Palette

A near-monochrome graphite stack lit by a single warm amber. The palette is almost entirely neutral so that the one accent can carry meaning rather than decoration.

### Primary
- **Ember** (`#e9a86a`): The lone accent. A warm amber used semantically and sparingly: the terminal prompt arrow, eyebrow labels and their leading hairline, the active link and "Live"/"Source" project links, the work-title-on-hover, focus rings, and text selection. It is the eye's only color cue, so it always marks something that matters.
- **Ember Hi** (`#f2bc84`): The brighter step, used only as the hover state of the primary (Ember-filled) button.

### Neutral
- **Canvas** (`#0b0c0e`): The page itself. A tinted near-black (never pure `#000`), it is the lowest surface and the default background everywhere.
- **Surface** (`#131419`): The first step up. Used for raised elements that sit on the canvas: the hero terminal panel and the hover background of icon buttons.
- **Elevated** (`#1c1e24`): The highest tonal surface, reserved for the rare element that must read as lifted (e.g. the focused skip link).
- **Line** (`#2a2d34`): The hairline. Every divider, border, section rule, and chip outline. This color does the structural work that shadows would do elsewhere.
- **FG** (`#f4f5f6`): Primary text (never pure `#fff`). Headlines, the wordmark, hovered links.
- **FG Secondary** (`#9ca0a6`): Body copy and supporting prose. The most-used text color.
- **FG Muted** (`#7c818c`): Mono metadata, index numbers, placeholder dots. Deliberately lifted from a darker draft to clear WCAG AA (4.5:1) on the canvas for small text.

### Named Rules
**The One Ember Rule.** The accent appears on no more than ~10% of any screen. Its rarity is the point: it is a signal, not a theme. If a second thing wants to be amber, one of them is wrong.

**The Tinted-Black Rule.** Never `#000` and never `#fff`. The darkest surface is `#0b0c0e` and the lightest text is `#f4f5f6`. Every neutral is tinted cool toward the graphite hue; pure black or white reads as unfinished here.

**The Color-Plus-Partner Rule.** Ember never carries meaning alone. Wherever it signals (link, status, prompt), a non-color partner travels with it (position, an icon, a weight shift, the leading hairline) so the meaning survives for color-blind readers.

## 3. Typography

**Display / Body Font:** Geist Sans (with `ui-sans-serif, system-ui, sans-serif`)
**Label / Metadata Font:** Geist Mono (with `ui-monospace, SF Mono, Menlo, monospace`)

**Character:** One contemporary neo-grotesque sans does all the human-readable work; its monospace sibling does all the machine-readable work. The pairing is the whole personality: Sans speaks, Mono records. The sans is set tight and confident at large sizes (negative tracking on display); the mono is set wide and calm (generous letter-spacing on labels). There is no serif and no third family.

### Hierarchy
- **Display** (Geist Sans, 600, `clamp(2.6rem, 1.1rem + 6.6vw, 6rem)`, line-height 0.98, tracking -0.03em): The few headline statements that anchor a section. Hero h1 and the Contact close. Used at most once or twice per view.
- **Headline** (Geist Sans, 600, `clamp(1.7rem, 1.1rem + 2.2vw, 2.7rem)`, line-height 1.08, tracking -0.02em): Section headings ("Selected work", "Tools I reach for").
- **Title** (Geist Sans, 500, ~`1.5–1.875rem`, tracking tight): Project names in the work log; shifts to Ember on row hover.
- **Body** (Geist Sans, 400, `1rem`, line-height 1.625, color FG Secondary): Descriptions and supporting prose, capped at ~65–75ch (`max-w-xl`). Lead paragraphs (hero subhead, contact body) step up to `1.125rem` (text-lg).
- **Label** (Geist Mono, 400, `0.78rem`, tracking 0.16em, uppercase, color Ember): Section eyebrows, each preceded by a 24px Ember hairline. Smaller mono labels (`text-xs`, wider tracking) head the skill groups, also in Ember.
- **Metadata** (Geist Mono, `text-xs`/`text-sm`, color FG Muted): Index numbers, roles, periods, status, stack chips, the email address. The supporting record layer.

### Named Rules
**The Mono Metadata Rule.** Prose is Sans; metadata is Mono. Roles, dates, status, stack tags, eyebrows, terminal text, and the email are always monospace. This split is not decorative; it is the information hierarchy. A date in Sans or a sentence in Mono breaks the logbook conceit.

**The Sparse-Display Rule.** Display type is rationed. At most one or two display-scale statements per view, surrounded by quiet. Its size is the emphasis; do not dilute it by setting ordinary copy large.

## 4. Elevation

This system uses **no shadows at all**. Depth is built entirely from stepped tonal surfaces (Canvas → Surface → Elevated) and 1px hairline borders in the Line color. A raised element is raised because it is a half-step lighter and outlined in a hairline, not because it floats on a blur. The only "lift" affordances are state-driven: the scroll-reveal translate, the secondary-button border brightening, and the sticky top bar's `backdrop-blur` over a translucent canvas.

### Named Rules
**The No-Shadow Rule.** `box-shadow` is forbidden as a depth device. If something needs to read as elevated, step its background up one tonal surface and give it a hairline border. A drop shadow here reads as a foreign import from a Material/SaaS system, which is exactly the anti-reference.

**The Hairline Rule.** Structure is drawn in 1px Line (`#2a2d34`) borders and never thicker as a decorative device. No 2px+ colored side-stripes, no heavy rules; the hairline's restraint is the aesthetic.

## 5. Components

Component character: **quiet but confident.** At rest everything is understated; in state (hover, focus) the response is decisive and immediate, mostly a color or border shift on a 150ms curve. No bounce, no scale-pop, no glass.

### Buttons
- **Shape:** Fully pill-rounded (`9999px`) for text buttons; small `6px` radius for icon-only buttons.
- **Primary:** Ember fill, Canvas-dark text, `10px 20px` padding, `text-sm` weight 500. The single highest-intent action (first CTA, usually Email).
- **Hover / Focus:** Primary brightens fill to Ember Hi (`#f2bc84`) over 150ms. Secondary brightens its border from Line to FG Muted and its text from FG Secondary to FG. Focus is the global 2px Ember outline at 3px offset.
- **Secondary:** Transparent on Canvas with a Line hairline border, FG Secondary text; same pill shape and padding. Used for all non-primary CTAs in a cluster.
- **Icon (ghost):** 36px square, `6px` radius, FG Secondary glyph; on hover the background fills to Surface and the glyph turns Ember. Used in the persistent top bar.

### Chips (stack tags)
- **Style:** Pill (`9999px`) with a Line hairline border, transparent fill, Mono `text-xs` in FG Muted, `4px 12px` padding. They read as quiet labels, not buttons.
- **State:** Static. Chips are informational and do not have hover or selected states.

### Cards / Containers
- **The default is no card.** See the No-Card Rule below. The one true container is the hero **Terminal** panel: `12px` radius, Surface background, Line hairline border, a faux titlebar (three muted dots plus a mono `~/dimitrios` path) over a monospace body where prompt lines are FG Muted, output is FG Secondary, and the leading arrow is Ember.

### Inputs / Fields
- None currently. The contact flow is mailto plus a click-to-copy email; there are no text inputs in the system today. If introduced, follow the hairline doctrine: Line border at rest, Ember focus ring, no inner shadow.

### Navigation
- **Top bar:** Sticky, translucent Canvas (`/80`) with `backdrop-blur`, a single bottom Line hairline. Left: wordmark (hover → Ember) plus a mono "Berlin" badge (pill, Line border, uppercase `11px`). Right: section links plus the icon CTA cluster, divided by a short vertical hairline.
- **Nav links:** `text-sm`, FG Secondary, with the signature animated hairline underline (scaleX 0 → 1, left origin, 300ms deliberate curve) that also fires on focus; text shifts to FG on hover.

### Work Entry (signature component)
The project log row, and the system's most opinionated piece. A 12-column grid separated from its neighbors by a top Line hairline: a mono index (`01`, `02`...) in column 1, the project name plus tagline plus description plus stack chips plus optional links in columns 2–8, and a right-aligned mono metadata stack (role / period / status) in the last four columns. The whole row is a hover group: the title shifts to Ember on hover. This is deliberately not a card.

### Copy-Email (signature interaction)
A mono button showing the address with a trailing copy icon; on click it writes to the clipboard, swaps the icon to a check for 2s, and announces "Copied to clipboard" via an `aria-live` status region. The icon tints Ember on hover. Degrades silently (address stays visible) when the clipboard API is unavailable.

### Eyebrow (signature label)
Every section opens with one: a 24px Ember hairline followed by a Mono, uppercase, wide-tracked Ember label. It is the visual "prompt" that starts each block and the most consistent expression of the logbook theme.

## 6. Do's and Don'ts

### Do:
- **Do** keep Ember (`#e9a86a`) under ~10% of any screen and always semantic (link, prompt, status, focus, active). Rarity is what makes it a signal.
- **Do** build depth with tonal surfaces (`#0b0c0e` → `#131419` → `#1c1e24`) and 1px Line (`#2a2d34`) hairlines.
- **Do** set all metadata (roles, dates, status, stack, eyebrows, email) in Geist Mono and all prose in Geist Sans.
- **Do** ration display type: one or two display-scale statements per view, surrounded by quiet.
- **Do** pair every Ember signal with a non-color cue (icon, position, weight, the leading hairline).
- **Do** give every interactive element a designed hover and a visible focus state (the 2px Ember ring), and make sure it all collapses under `prefers-reduced-motion`.
- **Do** hold the whole site to WCAG 2.2 AA, including contrast on the small mono metadata.

### Don't:
- **Don't** ship the **generic developer-portfolio template**: no animated skill bars, no uniform grid of identical project cards, no decorative gradient blob. Work goes in logbook rows.
- **Don't** drift toward the **corporate SaaS landing page**: no cream or pastel backgrounds, no soft rounded cards, no gentle gradients, no big-number hero-metric template.
- **Don't** use `box-shadow` as a depth device; step a tonal surface and add a hairline instead.
- **Don't** use pure `#000` or `#fff`; the tinted graphite neutrals are the floor and ceiling.
- **Don't** use `background-clip: text` gradient text, or any decorative gradient. Emphasis comes from scale and weight.
- **Don't** introduce a second accent color or a third type family. One Ember, one Sans, one Mono.
- **Don't** use a colored side-stripe (`border-left`/`border-right` > 1px) as an accent on any element. Hairlines are full and uniform.
- **Don't** reach for a card or a modal by reflex. Prefer the bordered grid row and the inline progressive pattern the system already uses.
