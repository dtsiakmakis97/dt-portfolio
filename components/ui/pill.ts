type PillVariant = "blue" | "ghost" | "ink";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 font-mono text-label uppercase transition-[background-color,border-color,color] duration-500 ease-glide";

const VARIANTS: Record<PillVariant, string> = {
  /** Primary action on the dark canvas: canvas text on blue (7:1). */
  blue: "bg-blue text-canvas hover:bg-ink",
  /** Secondary action on the dark canvas. */
  ghost: "border border-line-strong text-ink hover:border-blue hover:text-blue",
  /** Action inside a blue or paper band: canvas-colored only. */
  ink: "border border-canvas text-canvas hover:bg-canvas hover:text-paper",
};

/** Pill-or-zero: pills are the only rounded shape in the system. */
export function pill(variant: PillVariant): string {
  return `${BASE} ${VARIANTS[variant]}`;
}
