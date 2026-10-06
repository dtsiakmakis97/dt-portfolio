import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> for route changes (Phase 4). Purely additive:
    // browsers without the View Transitions API get an instant, correct swap.
    viewTransition: true,
  },
  // Kryora launched as Kryotera; keep old links (and the OG card path) alive.
  async redirects() {
    return [{ source: "/work/kryora/:path*", destination: "/work/kryotera/:path*", permanent: true }];
  },
};

export default nextConfig;
