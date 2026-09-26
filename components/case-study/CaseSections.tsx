import type { CaseBlock } from "@/lib/work/types";
import { ProseSection } from "./ProseSection";
import { Decisions } from "./Decisions";
import { StatementBand } from "./StatementBand";
import { CaseFigure } from "./CaseFigure";

/** Renders a study's blocks in order. Statement bands alternate blue, paper. */
export function CaseSections({ blocks }: { blocks: readonly CaseBlock[] }) {
  const tones = new Map<number, "blue" | "paper">();
  blocks.forEach((block, i) => {
    if (block.kind === "statement") tones.set(i, tones.size % 2 === 0 ? "blue" : "paper");
  });
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "prose":
            return <ProseSection key={i} label={block.label} paragraphs={block.paragraphs} />;
          case "decisions":
            return <Decisions key={i} intro={block.intro} items={block.items} />;
          case "statement":
            return <StatementBand key={i} text={block.text} tone={tones.get(i)!} />;
          case "figure":
            return <CaseFigure key={i} figure={block.figure} />;
        }
      })}
    </>
  );
}
