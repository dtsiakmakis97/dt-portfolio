import { Fragment } from "react";
import { hero } from "@/lib/content";

const LEAD_MS = 150;
const STAGGER_MS = 55;

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** Words with server-computed animation delays. Real spaces sit between the
 *  spans, so the heading's accessible name is the sentence itself. */
function WordRun({ list, start }: { list: string[]; start: number }) {
  return (
    <>
      {list.map((word, i) => (
        <Fragment key={start + i}>
          {i > 0 && " "}
          <span className="word-clip">
            <span className="word-rise" style={{ animationDelay: `${LEAD_MS + (start + i) * STAGGER_MS}ms` }}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** The statement h1: the whisper run at weight 300, the rest at 800 with the
 *  accent in blue. Throws at build time if the content drifts out of shape. */
export function HeroHeadline() {
  if (!hero.headline.startsWith(hero.whisper)) {
    throw new Error("lib/content.ts: hero.headline must start with hero.whisper");
  }
  const bold = hero.headline.slice(hero.whisper.length).trim();
  const at = bold.indexOf(hero.accent);
  if (at === -1) {
    throw new Error("lib/content.ts: hero.accent must appear after hero.whisper");
  }

  const whisper = words(hero.whisper);
  const before = words(bold.slice(0, at));
  const accent = words(hero.accent);
  const after = words(bold.slice(at + hero.accent.length));
  const s1 = whisper.length;
  const s2 = s1 + before.length;
  const s3 = s2 + accent.length;

  return (
    <h1 className="font-display text-hero text-ink">
      <span className="block font-light [text-wrap:balance]">
        <WordRun list={whisper} start={0} />
      </span>{" "}
      <span className="block font-extrabold [text-wrap:balance]">
        <WordRun list={before} start={s1} />{" "}
        <span className="whitespace-nowrap text-blue">
          <WordRun list={accent} start={s2} />
        </span>{" "}
        <WordRun list={after} start={s3} />
      </span>
    </h1>
  );
}
