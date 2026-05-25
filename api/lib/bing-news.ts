const API_ENDPOINT = "https://api.bing.microsoft.com/v7.0/news/search";

// RSS endpoint — no API key needed, returns standard RSS 2.0
const RSS_ENDPOINT = "https://www.bing.com/news/search";

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

let _apiCache: { items: FeedItem[]; at: number } | null = null;
let _rssCache: { items: FeedItem[]; at: number } | null = null;
const CACHE_TTL = 3_600_000;

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-MY,en;q=0.9,ms;q=0.8",
};

// ── Inline RSS parser helpers ─────────────────────────────────────────────────

function rssTag(xml: string, tag: string): string {
  return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]
    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim() ?? "";
}

function rssAttr(xml: string, tag: string, attr: string): string {
  return xml.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["']`, "i"))?.[1]?.trim() ?? "";
}

function splitItems(xml: string): string[] {
  return xml.split(/<item[^>]*>/i).slice(1).map(p => p.split(/<\/item>/i)[0] ?? "");
}

// ── Sentiment classifiers ────────────────────────────────────────────────────

const NEG_TERMS = ["perkahwinan kanak-kanak","kahwin bawah umur","penganiayaan","abuse","jenayah","mangsa","kematian","death","victim","violence","arrested","charged","assault","tragedi","dera"];
const POS_TERMS = ["perlindungan","protection","programme","program","bantuan","berjaya","success","improved","reduced","achievement","initiative","launched"];
const MARRIAGE_TERMS = ["perkahwinan","marriage","kahwin"];
const ABUSE_TERMS = ["penganiayaan","abuse","taska","violence","assault","jenayah","dera"];

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

function makeItem(title: string, desc: string, url: string, source: string, published: string): FeedItem {
  const text = `${title} ${desc}`.toLowerCase();
  const isNeg = NEG_TERMS.some(t => text.includes(t));
  const isPos = POS_TERMS.some(t => text.includes(t));
  const isMar = MARRIAGE_TERMS.some(t => text.includes(t));
  const isAbu = ABUSE_TERMS.some(t => text.includes(t));
  const tagArr = [
    isMar && "child marriage", isAbu && "abuse",
    text.includes("jkm") && "JKM", text.includes("taska") && "TASKA",
    text.includes("unicef") && "UNICEF",
    (text.includes("poverty") || text.includes("kemiskinan")) && "poverty",
  ].filter(Boolean) as string[];
  const ms  = published ? Date.now() - new Date(published).getTime() : 0;
  const h   = Math.round(ms / 3_600_000);
  return {
    content: title, snippet: desc.slice(0, 300), url,
    sentiment: isNeg ? "negative" : isPos ? "positive" : "neutral",
    riskLevel: isNeg && (isMar || isAbu) ? "high" : isNeg ? "medium" : "none",
    source, region: "Malaysia",
    tags: tagArr.join(",") || "child rights",
    engagement: h < 24 ? `${h}h ago` : `${Math.ceil(h / 24)}d ago`,
    publishedAt: published || new Date().toISOString(),
    topic: isMar ? "marriage" : isAbu ? "abuse" : "general",
  };
}

// ── Bing API (paid) ───────────────────────────────────────────────────────────

async function fetchViaAPI(apiKey: string): Promise<FeedItem[]> {
  const all: BingArticle[] = [];
  const seen = new Set<string>();
  for (const q of QUERIES) {
    try {
      const url = new URL(API_ENDPOINT);
      url.searchParams.set("q", q); url.searchParams.set("mkt", "en-MY");
      url.searchParams.set("count", "5"); url.searchParams.set("freshness", "Week");
      url.searchParams.set("safeSearch", "Moderate"); url.searchParams.set("textDecorations", "false");
      const res = await fetch(url.toString(), { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
      if (!res.ok) continue;
      const json: BingResponse = await res.json();
      for (const r of json.value ?? []) {
        if (!seen.has(r.url)) { seen.add(r.url); all.push(r); }
      }
    } catch { /* continue */ }
  }
  all.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  return all.map(a => makeItem(a.name, a.description, a.url, a.provider?.[0]?.name ?? "Bing News", a.datePublished));
}

// ── Bing RSS (no API key required) ───────────────────────────────────────────

async function fetchQueryRSS(q: string): Promise<FeedItem[]> {
  const url = `${RSS_ENDPOINT}?q=${encodeURIComponent(q)}&format=RSS`;
  const res = await fetch(url, { headers: BROWSER_HEADERS });
  if (!res.ok) throw new Error(`Bing RSS ${res.status} for "${q}"`);
  const xml = await res.text();
  return splitItems(xml).map(item => {
    const title = rssTag(item, "title");
    const link  = rssTag(item, "link") || rssAttr(item, "link", "href");
    if (!title || !link) return null;
    const desc   = rssTag(item, "description");
    const source = rssTag(item, "source") || rssAttr(item, "source", "url") || "Bing News";
    const pub    = rssTag(item, "pubDate");
    const isoDate = pub ? new Date(pub).toISOString() : new Date().toISOString();
    return makeItem(title, desc, link, source, isoDate);
  }).filter((x): x is FeedItem => x !== null);
}

async function fetchViaRSS(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  const seen = new Set<string>();
  for (const q of QUERIES) {
    try {
      const items = await fetchQueryRSS(q);
      for (const item of items) {
        if (!seen.has(item.url)) { seen.add(item.url); all.push(item); }
      }
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 300));
    } catch { /* continue */ }
  }
  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchBingNewsFeed(apiKey: string): Promise<FeedItem[]> {
  // API path (paid key)
  if (apiKey) {
    if (_apiCache && Date.now() - _apiCache.at < CACHE_TTL) return _apiCache.items;
    try {
      const items = await fetchViaAPI(apiKey);
      if (items.length > 0) {
        _apiCache = { items, at: Date.now() };
        return items;
      }
    } catch { /* fall through to RSS */ }
  }

  // RSS fallback (no key required)
  if (_rssCache && Date.now() - _rssCache.at < CACHE_TTL) return _rssCache.items;
  const items = await fetchViaRSS();
  _rssCache = { items, at: Date.now() };
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
    days[key] = { date: `${d.getDate()}/${d.getMonth() + 1}`, marriage: 0, abuse: 0, general: 0 };
  }
  for (const item of items) {
    const key = item.publishedAt.slice(0, 10);
    if (days[key]) days[key][item.topic]++;
  }
  return Object.values(days);
}
