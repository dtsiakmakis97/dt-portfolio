import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TopBar } from "@/components/chrome/TopBar";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Intro } from "@/components/chrome/Intro";
import { meta, profile } from "@/lib/content";
import { menuRows } from "@/lib/menu";
import { siteUrl } from "@/lib/site";
import { siteOpenGraph } from "@/lib/metadata";

// Display + body face: Cabinet Grotesk variable (Fontshare, ITF Free Font
// License in ./fonts/CabinetGrotesk-LICENSE.txt). One file covers 100-900.
const cabinet = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-cabinet",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

// Small caps metadata labels only. Self-hosted (SIL OFL, ./fonts/IBMPlexMono-
// LICENSE.txt) so a build never depends on fonts.googleapis.com: Google's own
// latin subset (U+0000-00FF, U+2000-206F), 10KB. Monospace fallbacks share
// Plex's 0.6em advance, so the swap never re-wraps a label.
const plexMono = localFont({
  src: "./fonts/IBMPlexMono-Regular-latin.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: meta.title, template: `%s · ${profile.name}` },
  description: meta.description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: siteOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

// The intro ends on its last frame or at once on any click, key or wheel. The
// listeners live here, not in React, so a skip works before hydration.
const HEAD_SCRIPT = `var h=document.documentElement;h.classList.add('js');
try{if(!navigator.webdriver&&!sessionStorage.getItem('intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
h.classList.add('intro');sessionStorage.setItem('intro-seen','1');
var ev=['pointerdown','keydown','wheel','touchstart'],end=function(){h.classList.remove('intro');ev.forEach(function(t){removeEventListener(t,end)})};
ev.forEach(function(t){addEventListener(t,end,{passive:true})});
addEventListener('animationend',function(e){if(e.animationName==='intro-layer-out')end()})}}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${plexMono.variable} antialiased`}
      // The page curtain runs on the root snapshot. React hides that snapshot
      // when no DOM change falls outside a <ViewTransition>, but only while
      // <html> has no inline view-transition-name (react-dom-client,
      // commitAfterMutationEffectsOnFiber, HostRoot). Naming it keeps the root.
      style={{ viewTransitionName: "root" }}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: lets CSS opt load reveals into hiding (app/styles/motion.css),
            and starts the wordmark intro on the first view of a session (app/styles/intro.css).
            Automated browsers skip it, so tests and crawlers see the page as a returning visitor. */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <Intro />
        <SmoothScroll />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopBar menu={menuRows} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
