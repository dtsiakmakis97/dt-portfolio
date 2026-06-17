/**
 * Single source of truth for all portfolio copy.
 *
 * Every value here is drawn from verified sources:
 *   - Career Ops Agent/cv.md
 *   - Career Ops Agent/config/profile.yml
 *   - Career Ops Agent/article-digest.md
 *   - wiki/projects/aegeon-website.md
 *
 * Guardrails (do not violate when editing): no invented metrics, titles, or
 * dates; lead PawGuard with the multi-agent dev system; no compensation; no
 * education claims (degree not completed); no bootcamp claims.
 */

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export type CtaKind = "email" | "github" | "linkedin" | "resume";

export interface Cta {
  readonly kind: CtaKind;
  readonly label: string;
  readonly href: string;
  /** Short label for compact (icon-adjacent) placements. */
  readonly short: string;
}

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  /** One-line headline framing. */
  readonly tagline: string;
  readonly role: string;
  readonly period: string;
  readonly status: string;
  readonly stack: readonly string[];
  readonly description: string;
  readonly links?: readonly ProjectLink[];
  /** Screenshot path under /public for the editorial media column; when absent
   *  the entry renders a typographic spec-panel instead of a fake image. */
  readonly image?: string;
  readonly imageAlt?: string;
}

export interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly summary: string;
  readonly highlights: readonly string[];
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
    "EU citizen, open to roles in Germany, Greece & Switzerland (remote-friendly).",
  languages: "English (fluent) · Greek (native) · German (basic)",
} as const;

export const nav: readonly NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const ctas: readonly Cta[] = [
  { kind: "email", label: "Email", short: "Email", href: `mailto:${profile.email}` },
  { kind: "resume", label: "Résumé", short: "CV", href: profile.resume },
  { kind: "github", label: "GitHub", short: "GitHub", href: profile.github },
  { kind: "linkedin", label: "LinkedIn", short: "LinkedIn", href: profile.linkedin },
];

export const hero = {
  eyebrow: "FULL-STACK ENGINEER · AI SYSTEMS",
  available: "Open to new roles · EU / remote-friendly",
  headline: "I build web products end to end, and the AI systems inside them.",
  /** Contiguous run within `headline` rendered in amber + drawn underline. */
  accent: "AI systems",
  subhead:
    "Three years shipping production frontends for German enterprise retail at KPS AG. Now building multi-agent AI systems and LLM products solo.",
} as const;

export const projects: readonly Project[] = [
  {
    id: "pawguard",
    name: "PawGuard",
    tagline: "A multi-agent development system in production.",
    role: "Solo: architecture, agents, full build",
    period: "2026",
    status: "In development · pilot pending",
    stack: ["React Native (Expo)", "Supabase", "Claude Code subagents", "TypeScript", "Vitest"],
    description:
      "A civic-tech mobile app routing structured animal-cruelty reports to the Athens Prosecutor's Office, engineered with four custom Claude Code subagents, each governed by a written constitution with explicit refusal cases (constitution-as-code), and automated privacy + RLS audit gates required before any merge. Zero-retention architecture: evidence is transmitted, never stored. Two independent audits approved with zero critical findings.",
  },
  {
    id: "lead-finder",
    name: "Lead Finder",
    tagline: "An LLM analyzer pipeline for lead generation.",
    role: "Solo: full-stack + LLM integration",
    period: "2026",
    status: "Shipped on Vercel",
    stack: ["Next.js 16", "React 19", "Supabase", "Gemini 2.5 Flash", "TypeScript"],
    description:
      "A lead-gen CRM that scores local-business websites 0–100 via a synchronous fan-out of four parallel LLM analyzers (placeholder, technical, visual, content) merged into one score with a one-line rationale. Vision and structured-JSON analysis run on Google Gemini 2.5 Flash; magic-link auth; shipped on Vercel with a full v2 frontend redesign and 156 tests green.",
  },
  {
    id: "aegeon",
    name: "Aegeon",
    tagline: "A full-stack direct-booking platform for a Greek rental.",
    role: "Solo: full-stack, payments, OTA sync",
    period: "2026",
    status: "Live in production",
    stack: ["Next.js 16", "Supabase", "Stripe", "next-intl (DE/EN/EL)", "Vercel Cron"],
    description:
      "A trilingual (DE/EN/EL) direct-booking site for a family-run, five-unit seaside rental. Stripe deposit checkout, a DIY two-way iCal sync to Airbnb and Booking.com over Vercel Cron, and Supabase as the single source of truth for inventory, bookings and content. Direct bookings save the 15–18% commission an OTA takes per stay.",
    image: "/work/aegeon.webp",
    imageAlt:
      "Aegeon booking site: gallery-luxury hero over a sea view on the Chalkidiki coast",
  },
  {
    id: "career-ops",
    name: "Career Ops Agent",
    tagline: "A multi-agent AI job-search system, plus its dashboard.",
    role: "Solo: fork customization + dashboard build",
    period: "2026",
    status: "Active",
    stack: ["Node.js", "Claude Code agents", "Next.js 16", "Tailwind v4", "Playwright"],
    description:
      "A Claude Code–native job-search system (forked from santifer/career-ops) that I customized for an AI-pivot search: a five-archetype role taxonomy with STAR-story selection and tailored ATS CV-PDF generation. I built its Next.js web dashboard from scratch: RSC routes for pipeline, inbox, follow-ups and progress charts, with a markdown-table writeback Server Action over the file substrate, no parallel database.",
  },
  {
    id: "te-learning-center",
    name: "T.E. Learning Center",
    tagline: "A Greek-first marketing site for a language school.",
    role: "Solo: design, build, content architecture",
    period: "2026",
    status: "Live",
    stack: ["Next.js 14", "React 18", "CSS custom properties", "Vercel"],
    description:
      "A Greek-first marketing site for a private English-language school (levels A1–C2) in Chalkidiki. A custom design system in CSS custom properties (no Tailwind), Greek-subset typography rendered at real text lengths, all copy centralised in one content module for non-technical edits, and WCAG AA throughout: trust through restraint rather than a sales funnel.",
    image: "/work/te-learning-center.webp",
    imageAlt:
      "T.E. Learning Center: Greek-first marketing site hero for a private English-language school",
    links: [{ label: "Live", href: "https://oikonomou.vercel.app" }],
  },
  {
    id: "edu-pipeline",
    name: "Edu Resource Pipeline",
    tagline: "An LLM pipeline that authors exam-board PDF bundles.",
    role: "Architecture, spec & review (built by Codex)",
    period: "2026",
    status: "End-to-end verified",
    stack: ["Python", "Pydantic v2", "OpenAI gpt-4.1", "Jinja2", "LaTeX + Beamer"],
    description:
      "A staged Python pipeline that turns source PDFs and a topic into nine print-ready PDFs for Edexcel iGCSE Mathematics (extract, generate, originality-check, render) with a Pydantic Topic schema as the single source of truth and authentic Edexcel-styled mark schemes in LaTeX/Beamer. I authored the full spec and TDD plan and ran the code review; implementation executed by Codex.",
  },
];

export const about: readonly string[] = [
  "I'm a frontend engineer from Greece, based in Berlin. For three years at KPS AG I shipped production e-commerce frontends for German retail brands (Dehner, NORMA, Jungheinrich and EP:) across SAP Commerce Cloud, Spryker, Magnolia and Storybook, with accessibility and performance as a constant discipline.",
  "These days I build AI systems on top of that frontend foundation, not instead of it. PawGuard is a multi-agent development system running in production; Lead Finder is an LLM analyzer pipeline; Aegeon and the T.E. Learning Center are full-stack sites I shipped solo. I care about systems that are accessible by default, fast under real budgets, and honest about what they do.",
];

export const experience: readonly ExperienceItem[] = [
  {
    company: "KPS AG",
    role: "Frontend Developer",
    period: "Dec 2022 – Oct 2025",
    location: "Berlin, Germany",
    summary:
      "Delivered modern, accessible, maintainable e-commerce frontends for major German retail clients across four stacks: performance, design-system consistency and clean integration in agile teams.",
    highlights: [
      "EP: SAP Commerce Cloud (CCV2) frontend; full WCAG audits and ARIA remediation across German, Swiss-French and Swiss-Italian markets.",
      "Jungheinrich: expanded a Storybook.js component library, building reusable components from design specs.",
      "NORMA: extended a Spryker webshop with custom, responsive, reusable components.",
      "Dehner: Spryker webshop integrated with Magnolia CMS; code reviews and CI/CD via GitHub Actions.",
    ],
  },
];

// Honest credibility facts for the ledger strip — derived from verified content, no invented metrics.
export const facts: readonly string[] = [
  "Berlin-based",
  "3 yrs enterprise frontend · KPS AG",
  "Multi-agent AI, shipped solo",
  "WCAG 2.2 AA audits",
  "EU citizen · remote-friendly",
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

export const contact = {
  eyebrow: "CONTACT",
  headline: "Let's talk.",
  body:
    "Looking for an engineer who can ship the frontend and the AI behind it? I'm open to new roles and happy to walk through any of the work above.",
} as const;

export const meta = {
  title: "Dimitrios Tsiakmakis · Full-stack & AI engineer",
  description:
    "Full-stack engineer in Berlin building production web products and the AI systems inside them. Three years of enterprise frontend at KPS AG; now shipping multi-agent AI systems and LLM products solo.",
} as const;
