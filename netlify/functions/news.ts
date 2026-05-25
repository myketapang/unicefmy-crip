/**
 * Standalone Netlify Function — no DB, no heavy deps.
 * Serves Bing News + Google Alerts feed items.
 * GET /.netlify/functions/news?type=bing|alerts|all
 */

const BING_ENDPOINT = "https://api.bing.microsoft.com/v7.0/news/search";
const BING_QUERIES = [
  "perkahwinan kanak-kanak Malaysia",
  "child marriage Malaysia",
  "penganiayaan kanak-kanak Malaysia",
  "TASKA abuse Malaysia",
  "hak kanak-kanak JKM",
  "child protection Malaysia UNICEF",
];

const NEG = ["perkahwinan kanak-kanak", "kahwin bawah umur", "penganiayaan", "abuse", "jenayah", "mangsa", "kematian", "death", "victim", "violence", "charged", "assault", "tragedi", "dera"];
const POS = ["perlindungan", "protection", "programme", "program", "bantuan", "berjaya", "success", "improved", "reduced", "achievement", "initiative", "launched"];
const MAR = ["perkahwinan", "marriage", "kahwin"];
const ABU = ["penganiayaan", "abuse", "taska", "violence", "assault", "jenayah", "dera"];

interface Item {
  content: string; snippet: string; url: string;
  sentiment: string; riskLevel: string; source: string;
  region: string; tags: string; engagement: string;
  publishedAt: string; topic: string;
}

function classify(title: string, desc: string, url: string, provider: string, published: string): Item {
  const text  = `${title} ${desc}`.toLowerCase();
  const isNeg = NEG.some(t => text.includes(t));
  const isPos = POS.some(t => text.includes(t));
  const isMar = MAR.some(t => text.includes(t));
  const isAbu = ABU.some(t => text.includes(t));
  const s     = isNeg ? "negative" : isPos ? "positive" : "neutral";
  const r     = isNeg && (isMar || isAbu) ? "high" : isNeg ? "medium" : "none";
  const tags  = [
    isMar && "child marriage", isAbu && "abuse",
    text.includes("jkm") && "JKM", text.includes("taska") && "TASKA",
    text.includes("unicef") && "UNICEF",
    (text.includes("poverty") || text.includes("kemiskinan")) && "poverty",
  ].filter(Boolean).join(",") || "child rights";
  const ms  = published ? Date.now() - new Date(published).getTime() : 0;
  const h   = Math.round(ms / 3_600_000);
  const eng = h < 24 ? `${h}h ago` : `${Math.ceil(h / 24)}d ago`;
  return { content: title, snippet: desc.slice(0, 200), url, sentiment: s, riskLevel: r,
    source: provider, region: "Malaysia", tags, engagement: eng,
    publishedAt: published || new Date().toISOString(),
    topic: isMar ? "marriage" : isAbu ? "abuse" : "general" };
}

async function fetchBing(apiKey: string): Promise<Item[]> {
  const all: Item[] = []; const seen = new Set<string>();
  for (const q of BING_QUERIES) {
    try {
      const url = new URL(BING_ENDPOINT);
      url.searchParams.set("q", q); url.searchParams.set("mkt", "en-MY");
      url.searchParams.set("count", "5"); url.searchParams.set("freshness", "Week");
      url.searchParams.set("safeSearch", "Moderate"); url.searchParams.set("textDecorations", "false");
      const res = await fetch(url.toString(), { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
      if (!res.ok) continue;
      const json = await res.json() as { value?: { name: string; description: string; url: string; provider: { name: string }[]; datePublished: string }[] };
      for (const a of json.value ?? []) {
        if (!seen.has(a.url)) {
          seen.add(a.url);
          all.push(classify(a.name, a.description, a.url, a.provider?.[0]?.name ?? "Bing News", a.datePublished));
        }
      }
    } catch { /* continue on per-query failure */ }
  }
  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function xtag(xml: string, tag: string): string {
  return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
}
function xhref(xml: string): string {
  return xml.match(/<link[^>]*\shref=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
}

async function fetchAlerts(urls: string[]): Promise<Item[]> {
  const all: Item[] = []; const seen = new Set<string>();
  for (const feedUrl of urls) {
    try {
      const res = await fetch(feedUrl, { headers: { Accept: "application/atom+xml,text/xml" } });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const entry of xml.split(/<entry[^>]*>/i).slice(1)) {
        const title = xtag(entry, "title"); const url = xhref(entry);
        if (!title || !url || seen.has(url)) continue;
        seen.add(url);
        const published = xtag(entry, "published") || xtag(entry, "updated");
        const content   = xtag(entry, "content") || xtag(entry, "summary");
        const src       = entry.match(/<source[\s\S]*?<\/source>/i)?.[0] ?? "";
        all.push(classify(title, content, url, src ? xtag(src, "title") : "Google Alerts", published));
      }
    } catch { /* continue */ }
  }
  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const handler = async (event: { queryStringParameters?: Record<string, string> | null }) => {
  const type      = event.queryStringParameters?.type ?? "all";
  const bingKey   = process.env.BING_NEWS_API_KEY ?? "";
  const alertUrls = (process.env.GOOGLE_ALERTS_RSS_URLS ?? "").split(",").map(u => u.trim()).filter(Boolean);

  let items: Item[] = [];
  if ((type === "bing" || type === "all") && bingKey)
    items = [...items, ...(await fetchBing(bingKey).catch(() => []))];
  if ((type === "alerts" || type === "all") && alertUrls.length) {
    const alertItems = await fetchAlerts(alertUrls).catch(() => []);
    const existing   = new Set(items.map(i => i.url));
    items = [...items, ...alertItems.filter(a => !existing.has(a.url))];
  }
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=1800",
    },
    body: JSON.stringify({ items, live: items.length > 0, count: items.length }),
  };
};
