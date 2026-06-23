import { ImageResponse } from "next/og";
import { hero, profile } from "@/lib/content";

export const alt =
  "Dimitrios Tsiakmakis — Full-stack engineer building web products and the AI systems inside them.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const EYEBROW = "OPEN TO NEW ROLES · EU";
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,·/—-:()&";

/** Fetch a subsetted TrueType for the given weight. The `&text=` param makes
 *  the Google CSS API return a `truetype` src (satori can't read WOFF2).
 *  Returns null on any failure so the build falls back to the default font. */
async function loadFont(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const text = GLYPHS + hero.headline + profile.name + profile.role + profile.location + EYEBROW;
  const [regular, semibold] = await Promise.all([loadFont(400, text), loadFont(600, text)]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[] = [];
  if (regular) fonts.push({ name: "IBM Plex Mono", data: regular, weight: 400, style: "normal" });
  if (semibold) fonts.push({ name: "IBM Plex Mono", data: semibold, weight: 600, style: "normal" });

  // Tint the accent run electric blue, word by word (satori wraps per flex item).
  const accentStart = hero.headline.indexOf(hero.accent);
  const accentEnd = accentStart + hero.accent.length;
  let cursor = 0;
  const words = hero.headline.split(" ").map((word, i) => {
    const start = cursor;
    cursor += word.length + 1;
    const accent = accentStart !== -1 && start >= accentStart && start < accentEnd;
    return (
      <span key={i} style={{ color: accent ? "#3b9dff" : "#f5f5f5", marginRight: "0.32em" }}>
        {word}
      </span>
    );
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f5",
          padding: 72,
          fontFamily: fonts.length ? "IBM Plex Mono" : undefined,
          fontWeight: 400,
        }}
      >
        {/* top bar: monogram + availability badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 600 }}>
            <span>DT</span>
            <span style={{ color: "#3b9dff" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 16,
              letterSpacing: 2,
              color: "#a3a3a3",
            }}
          >
            <div style={{ width: 10, height: 10, backgroundColor: "#3b9dff" }} />
            <span>{EYEBROW}</span>
          </div>
        </div>

        {/* the statement */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 60,
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: -1,
            maxWidth: 1010,
          }}
        >
          {words}
        </div>

        {/* footer: identity + standards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #262626",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 600 }}>{profile.name}</span>
            <span style={{ fontSize: 18, color: "#a3a3a3" }}>{profile.role}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
              fontSize: 16,
              color: "#525252",
            }}
          >
            <span>{profile.location}</span>
            <span>WCAG 2.2 AA</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
