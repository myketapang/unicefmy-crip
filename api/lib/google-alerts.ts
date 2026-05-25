import type { FeedItem } from "./bing-news.js";

// 30-minute cache per URL
const _cache = new Map<string, { items: FeedItem[]; at: number }>();
const CACHE_TTL = 1_800_000;

// Minimal Atom XML field extractor — no external deps
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  return xml.match(re)?.[1]?.trim().replace(/<[^>]+>/g, "").trim() ?? "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["']`, "i");
  return xml.match(re)?.[1]?.trim() ?? "";
}

function splitEntries(xml: string): string[] {
  return xml.split(/<entry[^>]*>/i).slice(1).map(p => p.split(/<\/entry>/i)[0] ?? "");
}

const NEG_TERMS = ["perkahwinan kanak-kanak", "kahwin bawah umur", "penganiayaan", "abuse", "jenayah", "mangsa", "kematian", "death", "victim", "violence", "charged", "assault", "tragedi", "dera"];
const POS_TERMS = ["perlindungan", "protection", "programme", "program", "bantuan", "berjaya", "success", "improved", "reduced", "achievement", "initiative", "launched"];
const MARRIAGE_TERMS = ["perkahwinan", "marriage", "kahwin"];
const ABUSE_TERMS = ["penganiayaan", "abuse", "taska", "violence", "assault", "jenayah", "dera"];

function classifyEntry(entry: string): FeedItem | null {
  const title = extractTag(entry, "title");
  const url = extractAttr(entry, "link", "href");
  const published = extractTag(entry, "published") || extractTag(entry, "updated");
  const content = extractTag(entry, "content") || extractTag(entry, "summary");
  const sourceBlock = entry.match(/<source[\s\S]*?<\/source>/i)?.[0] ?? "";
  const sourceName = sourceBlock ? extractTag(sourceBlock, "title") : "Google Alerts";

  if (!title || !url) return null;

  const text = `${title} ${content}`.toLowerCase();
  const isNeg = NEG_TERMS.some(t => text.includes(t));
  const isPos = POS_TERMS.some(t => text.includes(t));
  const sentiment = isNeg ? "negative" : isPos ? "positive" : "neutral";

  const isMarriage = MARRIAGE_TERMS.some(t => text.includes(t));
  const isAbuse = ABUSE_TERMS.some(t => text.includes(t));
  const riskLevel: FeedItem["riskLevel"] = isNeg && (isMarriage || isAbuse) ? "high" : isNeg ? "medium" : "none";

  const tagArr = [
    isMarriage && "child marriage",
    isAbuse && "abuse",
    text.includes("jkm") && "JKM",
    text.includes("taska") && "TASKA",
    text.includes("unicef") && "UNICEF",
    (text.includes("poverty") || text.includes("kemiskinan")) && "poverty",
  ].filter(Boolean) as string[];

  const ms = published ? Date.now() - new Date(published).getTime() : 0;
  const h = Math.round(ms / 3_600_000);
  const engagement = h < 24 ? `${h}h ago` : `${Math.ceil(h / 24)}d ago`;

  return {
    content: title,
    snippet: content.slice(0, 200),
    url,
    sentiment,
    riskLevel,
    source: sourceName || "Google Alerts",
    region: "Malaysia",
    tags: tagArr.join(",") || "child rights",
    engagement,
    publishedAt: published || new Date().toISOString(),
    topic: isMarriage ? "marriage" : isAbuse ? "abuse" : "general",
  };
}

async function fetchOneFeed(feedUrl: string): Promise<FeedItem[]> {
  const cached = _cache.get(feedUrl);
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.items;

  const res = await fetch(feedUrl, {
    headers: { Accept: "application/atom+xml,application/rss+xml,application/xml,text/xml" },
  });
  if (!res.ok) throw new Error(`Alerts RSS ${res.status} for ${feedUrl}`);
  const xml = await res.text();

  const items = splitEntries(xml).map(classifyEntry).filter((x): x is FeedItem => x !== null);
  _cache.set(feedUrl, { items, at: Date.now() });
  return items;
}

export async function fetchGoogleAlertsFeeds(): Promise<FeedItem[]> {
  const urls = (process.env.GOOGLE_ALERTS_RSS_URLS ?? "")
    .split(",")
    .map(u => u.trim())
    .filter(Boolean);

  if (!urls.length) return [];

  const all: FeedItem[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    try {
      const items = await fetchOneFeed(url);
      for (const item of items) {
        if (!seen.has(item.url)) { seen.add(item.url); all.push(item); }
      }
    } catch {
      // continue with remaining feeds on partial failure
    }
  }

  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
