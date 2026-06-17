"use client";

import dynamic from "next/dynamic";

// three.js is heavy and DOM-bound — load it client-only, off the critical path,
// so the static hero copy paints first and the WebGL never touches the server bundle.
const HeroNetwork = dynamic(
  () => import("./HeroNetwork").then((m) => m.HeroNetwork),
  { ssr: false, loading: () => null },
);

export function HeroBackground() {
  return <HeroNetwork />;
}
