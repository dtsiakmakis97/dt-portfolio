/**
 * Single source of truth for all portfolio copy.
 *
 * Every value here is drawn from verified sources:
 *   - Career Ops Agent/cv.md
 *   - Career Ops Agent/config/profile.yml
 *   - Career Ops Agent/article-digest.md
 *   - wiki/projects/{pawguard,lead-finder,aegeon-website,egodistillers-website,
 *     career-ops-agent,te-learning-center,kryora-website}.md (+ session notes)
 *   - docs/redesign/SPEC.md "Content model and accuracy" (corrections)
 *
 * Guardrails (do not violate when editing): no invented metrics, titles, or
 * dates; lead PawGuard with the multi-agent dev system; no compensation; no
 * education claims (degree not completed); no bootcamp claims.
 */

import type { Figure, ProjectSlug } from "@/lib/work/types";

export interface NavLink {
  readonly label: string;
  /** Home-page section, absolute so it works from every route. */
  readonly href: `/#${string}`;
}

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface Project {
  readonly slug: ProjectSlug;
  readonly name: string;
  /** One-line framing: home index row and case-study subtitle. */
  readonly tagline: string;
  /** One sentence, at most 160 characters: meta description and OG text. */
  readonly summary: string;
  readonly role: string;
  readonly period: string;
  readonly status: string;
  readonly stack: readonly string[];
  readonly links?: readonly ProjectLink[];
  /** Screenshot for the index preview and the case-study hero. */
  readonly cover?: Figure;
  /** Keep the case study out of search and the sitemap (unapproved client work). */
  readonly noindex?: boolean;
}

export interface ExperienceHighlight {
  readonly client: string;
  readonly detail: string;
}

export interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly summary: string;
  readonly highlights: readonly ExperienceHighlight[];
}

export interface SkillGroup {
  readonly label: string;
  readonly items: readonly string[];
}

export const profile = {
  name: "Dimitrios Tsiakmakis",
  firstName: "Dimitrios",
  role: "Full-stack engineer · AI systems",
  location: "Berlin, Germany",
  email: "dimitrists97@gmail.com",
  github: "https://github.com/dtsiakmakis97",
  linkedin: "https://linkedin.com/in/dimitriostsiakmakis",
  resume: "/resume.pdf",
  /** EU citizen; CV: open to DE / GR / CH, remote-friendly. profile.yml: Berlin preferred, EU remote OK. */
  availability:
    "EU citizen, open to roles in Germany, Greece & Switzerland (remote-friendly) and to freelance projects.",
  languages: "English (fluent) · Greek (native) · German (basic)",
} as const;

export const nav: readonly NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

export const hero = {
  /** Hero kicker: names me above the fold, and speaks to both audiences. */
  available: "Dimitrios Tsiakmakis · Berlin · Open to roles & freelance projects",
  headline: "I build web products end to end, and the AI systems inside them.",
  /** The opening run of `headline`, set at weight 300; the rest is set at 800. */
  whisper: "I build web products end to end,",
  /** Contiguous run inside the bold part, rendered in blue. */
  accent: "AI systems",
  subhead:
    "Three years shipping production frontends for German enterprise retail at KPS AG. Now building multi-agent AI systems and LLM products solo.",
} as const;

export const projects: readonly Project[] = [
  {
    slug: "pawguard",
    name: "PawGuard",
    tagline: "A civic-tech app built with a multi-agent development system.",
    summary:
      "An anonymous animal-cruelty reporting app for Greece, built with four custom Claude Code subagents and privacy and RLS audits that gate every merge.",
    role: "Solo: architecture, agents, full build",
    period: "2026",
    status: "In development · pilot pending",
    stack: ["React Native (Expo)", "Supabase", "Claude Code subagents", "TypeScript", "Vitest"],
    cover: {
      src: "/work/pawguard.webp",
      width: 1280,
      height: 800,
      alt: "PawGuard one-pager: mission and how-it-works overview for the Greece animal-welfare reporting app",
    },
    links: [{ label: "Overview", href: "https://pawguard-one-page.vercel.app/" }],
  },
  {
    slug: "lead-finder",
    name: "Lead Finder",
    tagline: "An LLM analyzer pipeline for lead generation.",
    summary:
      "A lead-gen CRM that scores local-business websites from 0 to 100 using technical, visual and content checks, two of them read by Gemini 2.5 Flash.",
    role: "Solo: full-stack + LLM integration",
    period: "2026",
    status: "Shipped on Vercel",
    stack: ["Next.js 16", "React 19", "Supabase", "Gemini 2.5 Flash", "TypeScript"],
    cover: {
      src: "/work/lead-finder.webp",
      width: 1280,
      height: 705,
      alt: "Lead Finder dashboard: lead-scoring CRM home with quick search, KPI cards and a recent-searches table",
    },
  },
  {
    slug: "aegeon",
    name: "Aegeon",
    tagline: "A trilingual booking site for a Greek seaside rental.",
    summary:
      "A DE/EN/EL booking-request site for a family-run, five-unit rental in Chalkidiki, with Supabase as the single source of truth and an owner-only admin.",
    role: "Solo: full-stack build, booking flow, iCal sync",
    period: "2026",
    status: "Live",
    stack: ["Next.js 16", "Supabase", "next-intl (DE/EN/EL)", "Vercel Cron", "Tailwind v4"],
    cover: {
      src: "/work/aegeon.webp",
      width: 1280,
      height: 960,
      alt: "Aegeon: English home page hero, the headline A place for stillness over a terrace sea view in Chalkidiki, with a Request booking button",
    },
  },
  {
    slug: "ego-distillers",
    name: "Ego Distillers",
    tagline: "A bilingual site for Gothenburg’s first distillery.",
    summary:
      "A Swedish/English site for a Gothenburg distillery, bar and restaurant: typed i18n, on-page table booking and a Resend form on a verified domain.",
    role: "Solo: design, build, integrations",
    period: "2026",
    status: "Live",
    stack: ["Next.js 16", "React 19", "Tailwind v4", "Resend", "Vercel"],
    cover: {
      src: "/work/ego-distillers.webp",
      width: 1280,
      height: 960,
      alt: "Ego Distillers: Swedish home page hero, an Ego Gin bottle standing in the sea under the headline Göteborgs första sprithus & bar",
    },
    links: [{ label: "Live", href: "https://egodistillers.com" }],
  },
  {
    slug: "career-ops",
    name: "Career Ops Agent",
    tagline: "A forked AI job-search system, and the dashboard I built for it.",
    summary:
      "A customized fork of santifer/career-ops for an AI-pivot job search, plus a Next.js dashboard I built from scratch over its markdown files, with no database.",
    role: "Solo: fork customization + dashboard build",
    period: "2026",
    status: "Personal tool, runs locally",
    stack: ["Node.js", "Claude Code agents", "Next.js 16", "Tailwind v4", "Playwright"],
  },
  {
    slug: "te-learning-center",
    name: "T.E. Learning Center",
    tagline: "A Greek-first marketing site for a language school.",
    summary:
      "A Greek-first site for a private English school in Chalkidiki: a custom CSS design system, Greek-subset typography and all copy in one module.",
    role: "Solo: design, build, content architecture",
    period: "2026",
    status: "Live",
    stack: ["Next.js 14", "React 18", "CSS custom properties", "Vercel"],
    cover: {
      src: "/work/te-learning-center.webp",
      width: 1280,
      height: 960,
      alt: "T.E. Learning Center: Greek levels overview, a path from first contact to advanced English, with cards for levels A1, A2 and B1",
    },
    links: [{ label: "Live", href: "https://oikonomou.vercel.app" }],
  },
  {
    slug: "kryora",
    name: "Kryora",
    tagline: "A Greek-first B2B landing site for whole-body cryotherapy chambers.",
    summary:
      "A Greek-market landing site for whole-body cryotherapy chambers: Greek-first type, CSS-only motion, a three-question model finder and bilingual SEO.",
    role: "Solo: direction, design, build",
    period: "2026",
    status: "Preview · awaiting client sign-off",
    stack: ["Next.js 16", "next-intl (EL/EN)", "Tailwind v4", "CSS scroll-driven animation", "Vitest"],
    cover: {
      src: "/work/kryora.webp",
      width: 1280,
      height: 960,
      alt: "Kryora: Greek home page hero, whole-body cryotherapy at −110 °C, beside an eCham flow chamber in a dimly lit spa",
      credit: "Imagery: kryora.de (AI renders)",
    },
    noindex: true,
  },
];

export const about: readonly string[] = [
  "I’m a frontend engineer from Greece, based in Berlin. For three years at KPS AG I shipped production e-commerce frontends for German retail brands (Dehner, NORMA, Jungheinrich and EP:) across SAP Commerce Cloud, Spryker, Magnolia and Storybook, with accessibility and performance as a constant discipline.",
  "These days I build AI systems on top of that frontend foundation, not instead of it. PawGuard is a civic-tech app I’m building with four custom Claude Code subagents and merge-blocking audit gates; Lead Finder is an LLM analyzer pipeline; Aegeon, Ego Distillers and the T.E. Learning Center are live sites I shipped solo.",
];

/** The About statement, rendered monumental; plain words, loud form. The
 *  values from the old About copy, said once, where they land hardest. */
export const manifesto = "Accessible by default. Fast under real budgets. Honest about what it does.";
/** Closing run of `manifesto` that fills to blue instead of ink. */
export const manifestoAccent = "Honest about what it does.";

/** Section statement. KPS AG, Dec 2022 to Oct 2025, matches "Three years" in the hero subhead. */
export const experienceStatement = "Three years at KPS AG.";

export const experience: readonly ExperienceItem[] = [
  {
    company: "KPS AG",
    role: "Frontend Developer",
    period: "Dec 2022 – Oct 2025",
    location: "Berlin, Germany",
    summary:
      "Delivered modern, accessible, maintainable e-commerce frontends for major German retail clients across four stacks: performance, design-system consistency and clean integration in agile teams.",
    highlights: [
      {
        client: "EP:",
        detail:
          "SAP Commerce Cloud (CCV2) frontend; full WCAG audits and ARIA remediation across German, Swiss-French and Swiss-Italian markets.",
      },
      {
        client: "Jungheinrich",
        detail: "Expanded a Storybook.js component library, building reusable components from design specs.",
      },
      { client: "NORMA", detail: "Extended a Spryker webshop with custom, responsive, reusable components." },
      {
        client: "Dehner",
        detail: "Spryker webshop integrated with Magnolia CMS; code reviews and CI/CD via GitHub Actions.",
      },
    ],
  },
];

// Credibility strip under the hero. Derived from verified content; no invented metrics.
export const facts: readonly string[] = [
  "Retail frontends: Dehner, NORMA, Jungheinrich, EP:",
  "LLM products & agent workflows, built solo",
  "WCAG audits · ARIA remediation",
];

export const skills: readonly SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3 / SCSS"],
  },
  {
    label: "Frontend",
    items: ["React", "React Native (Expo)", "Next.js (App Router, RSC, Server Actions)", "Tailwind CSS", "next-intl", "Storybook"],
  },
  {
    label: "AI / LLM",
    items: ["Anthropic Claude API", "Google Gemini API", "Multi-agent workflows (constitution-as-code, audit gates)", "Model Context Protocol (MCP)", "Prompt engineering"],
  },
  {
    label: "Backend & data",
    items: ["Supabase (Postgres, Auth, Storage, RLS, Edge Functions)", "PostgREST", "SQL schema & migrations"],
  },
  {
    label: "Tooling & infra",
    items: ["Vercel", "GitHub Actions", "Docker", "Turbopack / Vite", "pnpm", "Git"],
  },
  {
    label: "Practice",
    items: ["WCAG accessibility audits + ARIA", "Multilingual i18n (DE/EN/EL)", "Performance budgets", "Vitest & Playwright", "SAP Commerce · Spryker · Magnolia"],
  },
];

/** Decorative marquee words for the Stack band. Every entry appears in
 *  `skills`; the static list below the marquee carries the real content. */
export const stackMarquee: readonly string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "React Native",
  "Supabase",
  "Claude API",
  "Gemini API",
  "MCP",
  "Tailwind",
  "Playwright",
  "Vitest",
];

export const contact = {
  eyebrow: "CONTACT",
  headline: "Let’s talk.",
  body:
    "Looking for an engineer who can ship the frontend and the AI behind it? I’m open to new roles and freelance projects, and happy to walk through any of the work above.",
} as const;

export const meta = {
  title: "Dimitrios Tsiakmakis · Full-stack & AI engineer",
  description:
    "Full-stack engineer in Berlin building production web products and the AI systems inside them. Three years of enterprise frontend at KPS AG; now shipping multi-agent AI systems and LLM products solo.",
} as const;
