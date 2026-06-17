import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/chrome/TopBar";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { meta } from "@/lib/content";

// Display face — self-hosted (Fontshare, free for commercial use).
const cabinet = localFont({
  variable: "--font-cabinet",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  // Cabinet is display-only (body is mono); weights used are 500/700/800.
  // Regular (400) is loaded by nothing, so it is intentionally omitted.
  src: [
    { path: "./fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
});

// Body + metadata face — the "engineer" signal.
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${plexMono.variable} antialiased`}
    >
      <body className="relative min-h-screen">
        <div className="bg-grid" aria-hidden="true" />
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
