/** A verified fact set huge on a full-bleed band. Bands carry canvas-colored
 *  text only (ink on blue and blue on paper both fail contrast). A <p>, never
 *  a quote: these are facts, not testimonials. */
export function StatementBand({ text, tone }: { text: string; tone: "blue" | "paper" }) {
  return (
    <div data-statement="" className={`${tone === "blue" ? "band-blue" : "band-paper"} px-gutter py-[clamp(4rem,3rem+6vw,10rem)]`}>
      <p className="max-w-[18ch] font-display text-statement font-extrabold">{text}</p>
    </div>
  );
}
