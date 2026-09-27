import type { Page } from "@playwright/test";

export type Clip = { x: number; y: number; width: number; height: number };

type Reduction = "mean" | "brightest" | "luminance";

/** Screenshots a region, decodes it in a blank page (no image library) and
 *  reduces its pixels there, so only a few numbers cross the wire. */
async function reduceRegion(page: Page, clip: Clip, reduction: Reduction): Promise<number[]> {
  const png = (await page.screenshot({ clip })).toString("base64");
  const decoder = await page.context().newPage();
  const out = await decoder.evaluate(
    async ({ b64, reduction }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      if (reduction === "mean") {
        const sum = [0, 0, 0];
        for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
        return sum.map((v) => Math.round(v / (data.length / 4)));
      }
      if (reduction === "brightest") {
        let best = [0, 0, 0];
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] + data[i + 1] + data[i + 2] > best[0] + best[1] + best[2]) best = [data[i], data[i + 1], data[i + 2]];
        }
        return best;
      }
      // WCAG relative luminance, from exact sRGB.
      const lin = (v: number) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      let peak = 0;
      for (let i = 0; i < data.length; i += 4) {
        peak = Math.max(peak, 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]));
      }
      return [peak];
    },
    { b64: png, reduction },
  );
  await decoder.close();
  return out;
}

/** Average color of a small screenshot region. */
export function sampleColor(page: Page, clip: Clip): Promise<number[]> {
  return reduceRegion(page, clip, "mean");
}

/** The brightest pixel of a screenshot region, by channel sum. */
export function brightestPixel(page: Page, clip: Clip): Promise<number[]> {
  return reduceRegion(page, clip, "brightest");
}

/** The highest WCAG relative luminance (0 to 1) of any pixel in a screenshot region. */
export async function peakLuminance(page: Page, clip: Clip): Promise<number> {
  return (await reduceRegion(page, clip, "luminance"))[0];
}
