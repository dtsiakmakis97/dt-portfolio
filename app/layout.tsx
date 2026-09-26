import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/chrome/TopBar";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { InstrumentLayer } from "@/components/chrome/InstrumentLayer";
import { meta, profile } from "@/lib/content";
import { siteUrl } from "@/lib/site";

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

// Small caps metadata labels only.
const plexMono = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: "website",
    url: "/",
    siteName: profile.name,
    locale: "en_US",
  },
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
      <body className="relative min-h-screen">
        <div className="bg-grid" aria-hidden="true" />
        <InstrumentLayer />
        <ScrollProgress />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopBar />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
