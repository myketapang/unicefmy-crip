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

// ── Google Trends Trending Topics RSS (no API key, no npm package) ─────────────
// Endpoint: https://trends.google.com/trending/rss?geo=MY
// Returns: current trending search topics in Malaysia with related news articles

export interface TrendingTopic {
  title: string;
  traffic: string;           // e.g. "50K+"
  publishedAt: string;
  newsItems: { title: string; url: string; source: string }[];
  isChildRights: boolean;    // true if topic relates to child rights keywords
}

const CHILD_RIGHTS_KEYWORDS = [
  "kanak-kanak","child","marriage","perkahwinan","abuse","penganiayaan",
  "taska","jkm","kpwkm","poverty","kemiskinan","hak","rights","unicef",
];

let _trendingCache: { data: TrendingTopic[]; at: number } | null = null;

function xtag(xml: string, tag: string): string {
  return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]
    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "").trim() ?? "";
}

export async function fetchGoogleTrendingTopics(): Promise<TrendingTopic[]> {
  if (_trendingCache && Date.now() - _trendingCache.at < 1_800_000) return _trendingCache.data;

  const res = await fetch("https://trends.google.com/trending/rss?geo=MY", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; CRIP/1.0)", "Accept": "application/xml,text/xml" },
  });
  if (!res.ok) throw new Error(`Google Trending RSS ${res.status}`);
  const xml = await res.text();

  // Each <item> is a trending topic; nested <ht:news_item> are related articles
  const NS = "ht";
  const items = xml.split(/<item[^>]*>/i).slice(1);

  const data: TrendingTopic[] = items.map(block => {
    const title   = xtag(block, "title");
    const traffic = block.match(/<ht:approx_traffic[^>]*>([^<]+)<\/ht:approx_traffic>/i)?.[1]?.trim() ?? "";
    const pubDate = xtag(block, "pubDate");
    const isoDate = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();

    // Extract all <ht:news_item> sub-blocks
    const newsBlocks = block.split(/<ht:news_item[^>]*>/i).slice(1);
    const newsItems = newsBlocks.map(nb => ({
      title:  nb.match(/<ht:news_item_title[^>]*>([^<]+)<\/ht:news_item_title>/i)?.[1]?.trim() ?? "",
      url:    nb.match(/<ht:news_item_url[^>]*>([^<]+)<\/ht:news_item_url>/i)?.[1]?.trim() ?? "",
      source: nb.match(/<ht:news_item_source[^>]*>([^<]+)<\/ht:news_item_source>/i)?.[1]?.trim() ?? "",
    })).filter(n => n.title && n.url);

    const text = title.toLowerCase();
    const isChildRights = CHILD_RIGHTS_KEYWORDS.some(k => text.includes(k));

    return { title, traffic, publishedAt: isoDate, newsItems, isChildRights };
  }).filter(t => t.title);

  _trendingCache = { data, at: Date.now() };
  return data;
}
