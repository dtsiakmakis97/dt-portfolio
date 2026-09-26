import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TopBar } from "@/components/chrome/TopBar";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { meta, profile } from "@/lib/content";
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
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: lets CSS opt load reveals into hiding (app/styles/motion.css). */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="min-h-screen">
        <SmoothScroll />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopBar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
