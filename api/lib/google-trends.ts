import { createRequire } from "node:module";

const _require = createRequire(import.meta.url);
const googleTrends = _require("google-trends-api") as {
  interestOverTime: (opts: {
    keyword: string[];
    startTime: Date;
    endTime: Date;
    geo: string;
    hl?: string;
  }) => Promise<string>;
};

// Broader English terms with actual Google Trends volume in MY
const KEYWORDS = [
  "child marriage",
  "child abuse",
  "child rights",
];

export interface TrendPoint {
  date: string;       // short label e.g. "May 1"
  isoDate: string;    // e.g. "2026-05-01"
  interest: number;   // 0–100 Google Trends scale
  normalized: number; // 0–1 for chart overlay
}

// 1-hour cache
let _cache: { data: TrendPoint[]; at: number } | null = null;

export async function fetchGoogleTrends30d(): Promise<TrendPoint[]> {
  if (_cache && Date.now() - _cache.at < 3_600_000) return _cache.data;

  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 30);

  const raw = await googleTrends.interestOverTime({
    keyword: KEYWORDS,
    startTime,
    endTime,
    geo: "MY",
    hl: "en-MY",
  });

  const parsed = JSON.parse(raw) as {
    default: {
      timelineData: {
        formattedAxisTime: string;
        formattedTime: string;
        value: number[];
        hasData: boolean[];
      }[];
    };
  };

  const timeline = parsed?.default?.timelineData ?? [];

  // Average across all keywords → single "child rights attention" score
  const data: TrendPoint[] = timeline.map(pt => {
    const validValues = pt.value.filter((_, i) => pt.hasData[i]);
    const avg = validValues.length
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : 0;
    const parts = pt.formattedTime.split(",");
    const shortDate = parts[0]?.trim() ?? pt.formattedAxisTime;
    return {
      date: shortDate,
      isoDate: pt.formattedAxisTime,
      interest: Math.round(avg),
      normalized: Math.round(avg) / 100,
    };
  });

  _cache = { data, at: Date.now() };
  return data;
}
