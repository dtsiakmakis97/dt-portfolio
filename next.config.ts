import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> for route changes (Phase 4). Purely additive:
    // browsers without the View Transitions API get an instant, correct swap.
    viewTransition: true,
  },
  // Kryora launched as Kryotera; keep old links (and the OG card path) alive.
  // Two rules, not one `:path*`: an empty match leaves a trailing slash, and
  // Vercel then spends a second 308 removing it.
  async redirects() {
    return [
      { source: "/work/kryora", destination: "/work/kryotera", permanent: true },
      { source: "/work/kryora/:path+", destination: "/work/kryotera/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
