import { hero } from "@/lib/content";
import { OG_SIZE, renderCard } from "@/lib/og/render";

export const alt = "Dimitrios Tsiakmakis: I build web products end to end, and the AI systems inside them.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderCard({ kicker: "Berlin · Open to roles & freelance projects", title: hero.headline, accent: hero.accent, titleSize: 78 });
}
