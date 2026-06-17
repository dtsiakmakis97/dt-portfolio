import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { TopBar } from "@/components/chrome/TopBar";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { meta } from "@/lib/content";

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
  themeColor: "#0b0c0e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="sr-only rounded-md bg-elevated px-4 py-2 text-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <TopBar />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
