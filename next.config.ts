import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> for route changes (Phase 4). Purely additive:
    // browsers without the View Transitions API get an instant, correct swap.
    viewTransition: true,
  },
};

export default nextConfig;
