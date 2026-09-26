import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;

// Satori reads TTF/OTF/WOFF only and renders just a variable font's default
// instance, so the cards use static cuts from assets/og: Cabinet Grotesk Light
// and Extrabold (ITF Free Font License), IBM Plex Mono Regular (SIL OFL).
const FONT_FILES = [
  ["Cabinet", 300, "CabinetGrotesk-Light.otf"],
  ["Cabinet", 800, "CabinetGrotesk-Extrabold.otf"],
  ["Plex Mono", 400, "IBMPlexMono-Regular.ttf"],
] as const;

function loadFonts() {
  return Promise.all(
    FONT_FILES.map(async ([name, weight, file]) => ({
      name,
      weight,
      style: "normal" as const,
      data: await readFile(join(process.cwd(), "assets/og", file)),
    })),
  );
}

const COLOR = { canvas: "#0b0b0c", ink: "#f2f0ea", ink3: "#8c8a84", blue: "#3b9dff", line: "#2a2a2b" };

interface Card {
  kicker: string;
  /** The statement. `accent`, a run inside it, is set in blue. */
  title: string;
  accent?: string;
  /** Set at weight 300 under the title. */
  subtitle?: string;
  titleSize?: number;
}

function titleRuns(title: string, accent?: string) {
  const start = accent ? title.indexOf(accent) : -1;
  const end = start + (accent?.length ?? 0);
  let cursor = 0;
  return title.split(" ").map((word, i) => {
    const at = cursor;
    cursor += word.length + 1;
    const blue = start !== -1 && at >= start && at < end;
    return (
      <span key={i} style={{ color: blue ? COLOR.blue : COLOR.ink, marginRight: "0.24em" }}>
        {word}
      </span>
    );
  });
}

/** The shared card: mono kicker and the DT. mark, the statement in Cabinet
 *  800, an optional light subtitle, and a mono footer. */
export async function renderCard({ kicker, title, accent, subtitle, titleSize = 96 }: Card): Promise<ImageResponse> {
  const mono = { fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 2.5, color: COLOR.ink3 } as const;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: COLOR.canvas,
          color: COLOR.ink,
          fontFamily: "Cabinet",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...mono }}>
          <span>{kicker.toUpperCase()}</span>
          <span style={{ display: "flex", fontFamily: "Cabinet", fontWeight: 800, fontSize: 30, letterSpacing: 0, color: COLOR.ink }}>
            DT<span style={{ color: COLOR.blue }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontWeight: 800, fontSize: titleSize, lineHeight: 0.92, letterSpacing: -2 }}>
            {titleRuns(title, accent)}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 28, fontWeight: 300, fontSize: 40, lineHeight: 1.15, maxWidth: 980 }}>{subtitle}</div>
          ) : null}
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLOR.line}`, paddingTop: 24, ...mono }}
        >
          <span>{profile.name.toUpperCase()}</span>
          <span>{new URL(siteUrl).host.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
