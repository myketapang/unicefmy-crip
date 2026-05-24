const ENDPOINT = "https://api.bing.microsoft.com/v7.0/news/search";

// BM + EN keywords for child rights monitoring
const QUERIES = [
  "perkahwinan kanak-kanak Malaysia",
  "child marriage Malaysia",
  "penganiayaan kanak-kanak Malaysia",
  "TASKA abuse Malaysia",
  "hak kanak-kanak JKM",
  "child protection Malaysia UNICEF",
];

interface BingArticle {
  name: string;
  description: string;
  url: string;
  provider: { name: string }[];
  datePublished: string;
}

interface BingResponse {
  value?: BingArticle[];
}

// In-memory cache: 1 hour to stay within free quota (1,000 tx/month)
let _cache: { items: FeedItem[]; at: number } | null = null;
const CACHE_TTL = 3_600_000;

async function fetchQuery(apiKey: string, q: string): Promise<BingArticle[]> {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", q);
  url.searchParams.set("mkt", "en-MY");
  url.searchParams.set("count", "5");
  url.searchParams.set("freshness", "Week");
  url.searchParams.set("safeSearch", "Moderate");
  url.searchParams.set("textDecorations", "false");

  const res = await fetch(url.toString(), {
    headers: { "Ocp-Apim-Subscription-Key": apiKey },
  });
  if (!res.ok) throw new Error(`Bing ${res.status} for "${q}": ${await res.text()}`);
  const json: BingResponse = await res.json();
  return json.value ?? [];
}

const NEG_TERMS = ["perkahwinan kanak-kanak", "kahwin bawah umur", "penganiayaan", "abuse", "jenayah", "mangsa", "kematian", "death", "victim", "violence", "arrested", "charged", "assault", "tragedi", "dera"];
const POS_TERMS = ["perlindungan", "protection", "programme", "program", "bantuan", "berjaya", "success", "improved", "reduced", "achievement", "initiative", "launched"];
const MARRIAGE_TERMS = ["perkahwinan", "marriage", "kahwin"];
const ABUSE_TERMS = ["penganiayaan", "abuse", "taska", "violence", "assault", "jenayah", "dera"];

export interface FeedItem {
  content: string;
  snippet: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  riskLevel: "high" | "medium" | "low" | "none";
  source: string;
  region: string;
  tags: string;
  engagement: string;
  publishedAt: string;
  topic: "marriage" | "abuse" | "general";
}

function classify(a: BingArticle): FeedItem {
  const text = `${a.name} ${a.description}`.toLowerCase();

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
  const tags = tagArr.join(",") || "child rights";

  const source = a.provider?.[0]?.name ?? "Bing News";
  const ms = Date.now() - new Date(a.datePublished).getTime();
  const h = Math.round(ms / 3_600_000);
  const engagement = h < 24 ? `${h}h ago` : `${Math.ceil(h / 24)}d ago`;

  return {
    content: a.name,
    snippet: a.description,
    url: a.url,
    sentiment,
    riskLevel,
    source,
    region: "Malaysia",
    tags,
    engagement,
    publishedAt: a.datePublished,
    topic: isMarriage ? "marriage" : isAbuse ? "abuse" : "general",
  };
}

export async function fetchBingNewsFeed(apiKey: string): Promise<FeedItem[]> {
  if (_cache && Date.now() - _cache.at < CACHE_TTL) return _cache.items;

  // Sequential to avoid rate-limit burst; 6 queries × 5 results = up to 30 articles/hour
  const all: BingArticle[] = [];
  const seen = new Set<string>();
  for (const q of QUERIES) {
    try {
      const results = await fetchQuery(apiKey, q);
      for (const r of results) {
        if (!seen.has(r.url)) { seen.add(r.url); all.push(r); }
      }
    } catch {
      // continue with remaining queries on partial failure
    }
  }

  all.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  const items = all.map(classify);
  _cache = { items, at: Date.now() };
  return items;
}

// Aggregate daily article counts for time-series chart (last 14 days)
export function buildNewsTrend(items: FeedItem[]) {
  const days: Record<string, { date: string; marriage: number; abuse: number; general: number }> = {};
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    days[key] = { date: label, marriage: 0, abuse: 0, general: 0 };
  }

  for (const item of items) {
    const key = item.publishedAt.slice(0, 10);
    if (days[key]) days[key][item.topic]++;
  }

  return Object.values(days);
}
