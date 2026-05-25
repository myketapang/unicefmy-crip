/**
 * Build-time Google Trends prefetch.
 * Runs before `vite build` so the result lands in the static bundle.
 * Output: public/data/trends.json
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const _require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleTrends = _require("google-trends-api") as any;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR  = join(__dirname, "../public/data");
const OUT_FILE = join(OUT_DIR, "trends.json");

// Primary: broad English terms that have actual Google Trends search volume in MY
const KEYWORDS = [
  "child marriage",
  "child abuse",
  "child rights",
];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const endTime   = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 30);

  try {
    const raw = await googleTrends.interestOverTime({
      keyword: KEYWORDS,
      startTime,
      endTime,
      geo:  "MY",
      hl:   "en-MY",
    });

    const parsed   = JSON.parse(raw);
    const timeline = (parsed?.default?.timelineData ?? []) as {
      formattedTime:     string;
      formattedAxisTime: string;
      value:             number[];
      hasData:           boolean[];
    }[];

    const data = timeline.map(pt => {
      const valid = pt.value.filter((_, i) => pt.hasData[i]);
      const avg   = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
      return {
        date:       pt.formattedTime.split(",")[0]?.trim() ?? pt.formattedAxisTime,
        isoDate:    pt.formattedAxisTime,
        interest:   Math.round(avg),
        normalized: +(Math.round(avg) / 100).toFixed(3),
      };
    });

    const hasData = data.some(d => d.interest > 0);
    writeFileSync(OUT_FILE, JSON.stringify({ data, fetchedAt: new Date().toISOString(), live: hasData }, null, 2));
    if (hasData) {
      console.log(`✓ Google Trends: ${data.length} points → public/data/trends.json`);
    } else {
      console.warn("⚠ Google Trends returned all-zero interest — keywords below threshold. Chart will use static fallback.");
    }
  } catch (err) {
    console.warn("⚠ Google Trends prefetch failed:", err instanceof Error ? err.message : String(err));
    writeFileSync(OUT_FILE, JSON.stringify({ data: [], fetchedAt: new Date().toISOString(), live: false }, null, 2));
  }
}

main();
