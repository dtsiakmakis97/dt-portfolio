---
name: Dimitrios Tsiakmakis Portfolio
description: A bold typographic portfolio on a dark canvas; monumental type carries the voice, exact labels carry the facts.
colors:
  canvas: "#0b0b0c"
  raised: "#141415"
  line: "#2a2a2b"
  line-strong: "#6b6964"
  ink: "#f2f0ea"
  paper: "#f2f0ea"
  ink-2: "#a19e96"
  ink-3: "#8c8a84"
  ink-dim: "#6b6964"
  blue: "#3b9dff"
  danger: "#f87171"
typography:
  display:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(4.5rem, 20vw, 22rem)"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.05em"
  hero:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, min(10vw, 15.5svh), 12rem)"
    fontWeight: 300
    lineHeight: 0.82
    letterSpacing: "-0.045em"
  statement:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Cabinet Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.14em"
    fontFeature: "\"zero\" 1"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(6rem, 4rem + 8vw, 12rem)"
components:
  pill-blue:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.label}"
  pill-blue-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
  pill-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.label}"
  pill-ghost-hover:
    textColor: "{colors.blue}"
  pill-ink:
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.label}"
  pill-ink-hover:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.paper}"
  cta-round:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    size: "10rem"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    typography: "{typography.body}"
---

# Design System: Dimitrios Tsiakmakis Portfolio

## 1. Overview

**Creative North Star: "The Monument and the Footnote"**

Two voices share every screen. The monument is type set so large it becomes the image: the hero statement, the width-fitted project titles, the full-bleed statement bands, the footer wordmark. The footnote is small, exact and mono: the crumb, the section labels, the meta strip, the captions. The monument makes the page bold; the footnote keeps it honest. Neither borrows the other's job, which is how the site stays loud in form and plain in its words.

The canvas is near-black, the one color is an electric blue used loudly (full-bleed bands, the page-transition curtain, a single accent run in the hero, the lens field behind it), and the only second surface is warm paper, used as a band. Motion is slow and gliding on one curve (the glide, identical to GSAP's expo.out), tied to scroll rather than running on its own, and it arrives after the page is already readable. The one exception is the hero's lens field, which drifts and leans toward the pointer, and carries a Pause motion control. Typography is the visual: beyond that field there is no illustration, no decorative imagery and no chrome that competes with the words, and the field never brightens behind a word past what keeps it at 4.5:1.

The system rejects the **generic developer-portfolio template** (hero plus animated skill bars plus a uniform grid of identical project cards plus a decorative gradient blob) and the **corporate SaaS landing page** (cream or pastel backgrounds, soft rounded cards, gentle gradients, the big-number hero-metric template). Both look like everyone else and perform confidence instead of earning it.

**Key Characteristics:**
- Monumental Cabinet Grotesk, weight 300 against 800, at line-heights near 0.8.
- One loud blue, carried by bands, one accent run and the hero's lens field.
- Dark, grainy blue liquid behind the hero, seen partly through a drifting glass sphere, dimmed behind every word.
- Mono labels in wide uppercase for every fact that supports the type.
- Pills or square corners, nothing in between.
- Slow, scroll-linked motion that loads after the page and respects reduced motion completely.
- A blue curtain between pages, with the project title and image morphing from the index into the case study.

## 2. Colors: The Night and Signal Palette

A near-black canvas, warm off-white ink stepped down for hierarchy, and one electric blue that is either a whole band or a single word.

### Primary
- **Electric Signal Blue** (#3b9dff): full-bleed statement bands, the page-transition curtain, the hero's accent run, the primary pill, the round contact action, focus rings and selection. As text it lives only on the canvas (7.0:1).

### Neutral
- **Night Canvas** (#0b0b0c): the page and every section by default; tinted, never pure black.
- **Raised Canvas** (#141415): form fields and the one raised panel (the form's sent state).
- **Hairline** (#2a2a2b): decorative dividers only (the meta strip, the decisions list, the work index).
- **Strong Hairline** (#6b6964): control borders, 3.6:1, for inputs and the ghost pill.
- **Warm Ink** (#f2f0ea): headlines and primary text, 17.3:1.
- **Warm Paper** (#f2f0ea): the paper band surface, the same value as the ink, used as ground.
- **Secondary Ink** (#a19e96): body copy and supporting prose, 7.3:1.
- **Label Ink** (#8c8a84): mono labels and captions, 5.7:1.
- **Dim Ink** (#6b6964): large text only, 3.6:1.
- **Alert Red** (#f87171): form errors, always paired with an icon and a message.

### Named Rules
**The Blue-Band Ink Rule.** Blue and paper bands carry canvas-colored text only; ink on blue and blue on paper are both 2.5:1 and fail. Focus rings and selection invert inside a band.

**The Blue-Only-On-Dark Rule.** Blue is text only on the canvas, never text on paper.

**The Ink-Dim-Large-Only Rule.** Dim ink (3.6:1) is for text of 24px and up only; anything smaller steps up to label ink or secondary ink.

## 3. Typography

**Display Font:** Cabinet Grotesk variable, 100 to 900 (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Cabinet Grotesk variable (with the same fallbacks)
**Label/Mono Font:** IBM Plex Mono, Latin subset, weight 400 (with ui-monospace, SF Mono, Menlo)

**Character:** one grotesk does all the talking, pushed from a hairline 300 to a heavy 800 and set tight at monumental sizes; the mono only records, in small wide capitals with a slashed zero.

### Hierarchy
- **Display** (800, clamp(4.5rem, 20vw, 22rem), 0.8): “Let’s talk.” and the 404.
- **Hero** (300 against 800, clamp(3rem, min(10vw, 15.5svh), 12rem), 0.82): the home statement; capped by viewport height so the call to action stays above the fold.
- **Statement** (800, clamp(2.75rem, 8vw, 9.5rem), 0.82): statement bands, the manifesto fill and section statements.
- **Fitted title** (800, computed per title): project titles fill their row exactly; the index row and the case-study h1 share one fit rule, so the morph between them is nearly a pure translate.
- **Headline** (800, clamp(2.25rem, 5vw, 5rem), 0.9): section headings, the experience client rows and the mobile menu links.
- **Title / lead** (300 or 400, clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem), 1.2): taglines and lead paragraphs; decision summaries take the same size at 800.
- **Body** (400, clamp(1.125rem, 1rem + 0.3vw, 1.25rem), 1.55): prose, capped at 62ch.
- **Label** (Plex Mono 400, 0.75rem, 0.14em, uppercase): crumbs, section labels, meta terms, captions, pills.

### Named Rules
**The One-Monument-Per-Viewport Rule.** One monumental type block per screen. A fitted title, a statement band or the wordmark; never two competing in one view.

**The LCP-Text-Never-Waits-On-JS Rule.** The hero h1 is split into words on the server and animated with CSS only, so it is the largest paint at first paint and never waits on a script.

## 4. Elevation

This system is flat. There are no shadows anywhere: depth comes from the canvas stepping up to the raised surface, from 1px hairlines, and from the bands, which change the ground itself. The only thing that ever sits above the page is the fixed header, and it earns its separation with a solid canvas background once the page scrolls, not with a shadow.

### Named Rules
**The Flat-Ground Rule.** Box shadows are prohibited. If something must read as separate, give it a band, a raised surface or a hairline.

## 5. Components

Components are few and quiet at rest; the type does the performing. States answer on the glide curve over 300 to 500ms.

### Buttons (pills)
- **Shape:** full pill (9999px) or square; never a small radius.
- **Blue pill:** blue ground, canvas text, 12px by 24px, mono label; hover turns the ground to ink.
- **Ghost pill:** strong-hairline border, ink text; hover moves border and text to blue.
- **Ink pill:** the action inside a band; a canvas border and canvas text, filling with canvas on hover.
- **Round contact action:** a 10rem blue circle with a mono label, magnetic toward a fine pointer.

### Inputs / Fields
- **Style:** raised canvas, strong-hairline border (3.6:1), square corners, body type, label ink for placeholders.
- **Focus:** the border turns blue, plus the global 2px blue ring at 3px offset.
- **Error:** the border turns alert red; the message below carries an icon, and the field is marked invalid for assistive tech. The honeypot never shows.

### Navigation
- **TopBar:** fixed; transparent over the hero, solid canvas once scrolled. At the top of a page: the wordmark "DT." with a blue period on the left, mono uppercase section links in the middle with a blue hairline that draws in on hover and marks the current section, a ghost pill on the right. Past the hero (0.85 of a viewport) it collapses: the links fold up out of their masks and go inert, the section in view is named in a mono label where they were, and a Menu pill takes the Email pill's place. On case studies the section links lead back to the home sections under the reverse curtain.
- **SiteMenu:** a full-screen native dialog (focus kept inside, closed by Escape, scrolling paused behind it), opened by the Menu pill: on a phone always, wider once the header has collapsed. It drops in like the page curtain; the five sections are monumental rows between hairlines, rising through masks. Hovering or focusing a row floods it with a blue band, text in the canvas color, where that section's facts run past: project names between pill-cropped covers for Work, the square period between the others. The facts are drawn from the page's own content (lib/menu.ts), the run moves only while its row is hovered or focused, and under reduced motion the band is still. After K72's menu.

### Intro
- **What:** the first view of a session opens on a giant "DT." on the canvas; the blue square period pops in, then the mark flies into the header logo while the ground lifts away like the page curtain. About 1.3s on the glide curve, and the hero's words rise as they are revealed (`--intro-delay`).
- **Honest by construction:** nothing is loading, so there is no counter or bar. The page renders underneath from the first frame: the mark is SVG outlines of Cabinet 800 (never the LCP), and the headline stays the largest paint with the first paint on a first visit too (e2e/perf.spec.ts).
- **Gated before first paint** by the `<head>` script: once per session (sessionStorage), never under reduced motion, never without JavaScript, skipped by automated browsers. Any click, key or wheel ends it at once, before hydration too. It is `aria-hidden` and holds nothing focusable.
- **The exception:** docs/redesign/SPEC.md rejects preloaders and intro screens. This is the one sanctioned exception, on those terms: short, once, skippable, over a page that is already there.

### Hero lens field
- **What:** full-bleed liquid bands of the blue on the canvas behind the hero, seen partly through a large glass sphere, under film grain. Raw WebGL in two passes (components/hero/field.ts, no library): domain-warped noise renders at half resolution into a texture, then the sphere refracts it (magnified at the centre, turned over toward the rim, a slight channel split and a thin line of light at the edge) and grain goes on at full resolution. The bands drift; the liquid parts around the pointer and the sphere leans a little toward it. Touch gets the drift only.
- **One hue, dark-dominant:** canvas, a deep ink-blue, the blue and a pale tint of it on the crests. The light gathers to the right, a dusk runs along the top edge under the header, and the hero meets the next section on the bare canvas. This is the one sanctioned gradient on the site, and the guardrails are what keep it from reading as the template blob: never pastel, never a second hue, always under grain, never brighter behind a word than its cap.
- **The shelter:** every element marked `data-shelter` (each headline word, the kicker, the subhead, the actions, the badge, the pause control, and the header's wordmark, links and pill over the hero) caps the field's luminance behind it, hue kept, in a pill around it that fades out over 120px. The cap comes from the dimmest color that element's text can take at rest or in any state (its Tailwind text utilities), so every word keeps 4.8:1 by construction, above the 4.5:1 AA bar. A big ink headline word lets a mid blue through; small mono text sits near the canvas.
- **Pause motion:** a mono control at the hero's top right stops the drift and is remembered across visits (WCAG 2.2.2). Reduced motion shows one still frame and no control; without WebGL or JavaScript the hero is plain canvas, as before.
- **Cost:** loads after the page's load event and stops drawing whenever the hero is off screen or the tab is hidden. The noise runs on a quarter of the pixels; a frame governor drops to 1x and then to a still frame on a renderer that can't keep up.

### Hero
- **HeroHeadline:** the statement in hero type, 300 against 800, with "AI systems" in blue; words rise through masks on CSS alone, with a failsafe so nothing stays hidden.
- **RotatingBadge:** a circular mono text ring that turns only with scroll and links to the work.

### Scroll-driven type
- **ScrollFillText:** the manifesto, filling word by word from dim to ink as it scrolls through.
- **SplitReveal:** below-the-fold headings and leads rising line by line through masks, once; a reader who already scrolled past sees them in place.
- **VelocityMarquee:** the oversized band of skills in the blue stack section, moving and leaning only with scroll; decorative, with the real list beside it.

### Work index
Seven full-width title links, each fitted to its row, with a mono year above the title and the tagline and status below; no numbering. On a fine pointer a 16:10 preview follows the cursor and becomes the image that morphs into the case study; Escape dismisses it. Phones show type only.

### Case-study frame
A mono crumb and a way back to the index, the fitted h1 (the morph lands here), a light tagline, a 16:10 hero image or, without one, a blue band with the status set large and a way to ask for a walkthrough. Then the lead, a meta strip of role, year, status, stack and public links, and the sections: prose under sticky mono labels, a numbered list of decisions, captioned figures no wider than their source.

### StatementBand
A verified fact set in statement type on a full-bleed band. Tones alternate blue then paper and never sit side by side; always a paragraph, never a quote.

### NextProject
The next project's name fitted to the width like its index title, its tagline beneath, and the "All work" pill. It changes pages under the curtain, with no title morph.

### Page transitions
A blue curtain between pages: the old page lifts off a blue ground and the new one rises in over it. Going from the index to a case study, the title and image morph into place above the curtain. The browser's Back and Forward swap instantly. The curtain runs on the viewport-sized root snapshot, never on a whole page: a page-length capture stalls the first frame.

### Named Rules
**The Pill-or-Zero Rule.** Full pills (the round call to action, the badge, the pills) or zero radius. Nothing in between.

**The Scroll-Linked-Never-Autonomous Rule.** The marquee and the badge move only with scroll, never on their own (WCAG 2.2.2). The hero's lens field is the one exception: it drifts on its own, so it carries a Pause motion control.

**The Motion-After-Load Rule.** GSAP and the hero field load after the page's load event (`afterLoad` in lib/motion/load.ts), so no motion code is on the first paint's critical path; reveals the reader has already reached stay put. The intro is CSS on server-rendered markup, gated by a few lines of inline script, and never delays the page under it.

## 6. Do's and Don'ts

### Do:
- **Do** set every band's text in the canvas color (#0b0b0c), and put blue text only on the canvas.
- **Do** keep one monumental block per viewport, and let the mono labels carry the facts around it.
- **Do** use the glide curve (cubic-bezier(0.19, 1, 0.22, 1)) at 0.8 to 1.1s for anything that moves, tie it to scroll where possible, and collapse all of it under reduced motion.
- **Do** keep the hero h1 server-rendered and CSS-animated so it paints first.
- **Do** keep text of 24px and up as the only home for dim ink (3.6:1).
- **Do** give every interactive element the 2px blue focus ring at 3px offset, inverted to canvas inside a band.
- **Do** meet WCAG 2.2 AA everywhere, including the small mono labels.

### Don't:
- **Don't** ship the **generic developer-portfolio template**: hero plus animated skill bars plus a uniform grid of identical project cards plus a decorative gradient blob.
- **Don't** drift toward the **corporate SaaS landing page**: cream or pastel backgrounds, soft rounded cards, gentle gradients, the big-number hero-metric template.
- **Don't** set ink on blue or blue on paper; both are 2.5:1.
- **Don't** use any radius other than a full pill or zero.
- **Don't** let anything move on its own: no autoplaying marquee, no spinning badge without scroll. The hero field is the one exception, and it keeps its pause control.
- **Don't** add hero text without `data-shelter`: the field only dims behind what is marked.
- **Don't** make the first paint wait on JavaScript, or load the motion library before the page's load event.
- **Don't** use box shadows, glassmorphism (frosted panels), gradient text or a second accent color. The hero's glass sphere is part of the field, holds no content and is the only optical element on the site.
- **Don't** put an adjective or an invented number where a fact should be; the form is loud so the words don't have to be.
