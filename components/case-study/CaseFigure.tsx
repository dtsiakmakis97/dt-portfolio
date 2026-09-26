import Image from "next/image";
import type { Figure } from "@/lib/work/types";

export function CaseFigure({ figure }: { figure: Figure }) {
  return (
    <figure className="px-gutter py-[clamp(3rem,2rem+4vw,7rem)]">
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes="(min-width: 1440px) 1328px, 100vw"
        className="h-auto w-full"
      />
      {figure.caption || figure.credit ? (
        <figcaption className="mt-3 font-mono text-label uppercase text-ink-3">
          {[figure.caption, figure.credit].filter(Boolean).join(" · ")}
        </figcaption>
      ) : null}
    </figure>
  );
}
