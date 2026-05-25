import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { TrendingUp, AlertTriangle, ExternalLink, Wifi, WifiOff } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function SentimentPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "sentiment" });
  const { data: keywords } = trpc.crip.sentiment.keywords.useQuery();
  const { data: dbFeed } = trpc.crip.sentiment.feed.useQuery();
  const { data: bingData } = trpc.crip.sentiment.bingFeed.useQuery();
  const { data: alertsData } = trpc.crip.sentiment.alertsFeed.useQuery();
  const { data: googleTrendData } = trpc.crip.sentiment.googleTrend.useQuery();
  const [activeTopic, setActiveTopic] = useState<"all" | "marriage" | "abuse">("all");
  const { data: dbTrendData } = trpc.crip.sentiment.trend.useQuery({ topic: activeTopic });

  // ── Static JSON fallback (built at deploy time, works with no backend) ──
  const [staticTrends, setStaticTrends] = useState<{ date: string; isoDate: string; interest: number; normalized: number }[]>([]);
  const [netlifyFeed, setNetlifyFeed] = useState<any[]>([]);
  const [netlifyLive, setNetlifyLive] = useState(false);

  useEffect(() => {
    // Always try to load build-time trends data
    fetch("/data/trends.json")
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json?.live && json?.data?.length) setStaticTrends(json.data); })
      .catch(() => {});

    // In production (no tRPC backend on Netlify), fetch from Netlify Function
    if (import.meta.env.PROD) {
      fetch("/.netlify/functions/news?type=all")
        .then(r => r.ok ? r.json() : null)
        .then(json => {
          if (json?.items?.length) {
            setNetlifyFeed(json.items.map((i: any) => ({ ...i, _src: "netlify" })));
            setNetlifyLive(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const mData = metrics || [];
  const kw = keywords || [];

  // ── Source availability ───────────────────────────────────────
  const gTrends = googleTrendData?.data ?? [];
  const gTrendsLive = googleTrendData?.live ?? false;
  const bingItems = bingData?.items ?? [];
  const bingLive = bingData?.live ?? false;
  const bingTrend = bingData?.trend ?? [];
  const alertsItems = alertsData?.items ?? [];
  const alertsLive = alertsData?.live ?? false;

  // ── Trend chart: tRPC live → static JSON (build-time) → DB → hardcoded ──
  const useGoogleTrends = (gTrendsLive && gTrends.length > 0) || staticTrends.length > 0;
  const activeTrendsData = (gTrendsLive && gTrends.length > 0) ? gTrends : staticTrends;
  const useDbTrend = !useGoogleTrends && (dbTrendData?.length ?? 0) > 0;

  const staticTrend = [
    { date: "May 1",  val: 0.42 }, { date: "May 2",  val: 0.38 }, { date: "May 3",  val: 0.45 },
    { date: "May 4",  val: 0.30 }, { date: "May 5",  val: 0.15 }, { date: "May 6",  val: -0.10 },
    { date: "May 7",  val: -0.32 }, { date: "May 8",  val: -0.48 }, { date: "May 9",  val: -0.55 },
    { date: "May 10", val: -0.60 }, { date: "May 11", val: -0.52 }, { date: "May 12", val: -0.38 },
    { date: "May 13", val: -0.20 }, { date: "May 14", val: 0.05 }, { date: "May 15", val: 0.18 },
    { date: "May 16", val: 0.28 }, { date: "May 17", val: 0.35 }, { date: "May 18", val: 0.40 },
    { date: "May 19", val: 0.45 }, { date: "May 20", val: 0.50 }, { date: "May 21", val: 0.42 },
    { date: "May 22", val: 0.38 }, { date: "May 23", val: 0.44 }, { date: "May 24", val: 0.40 },
    { date: "May 25", val: 0.36 }, { date: "May 26", val: 0.42 }, { date: "May 27", val: 0.48 },
    { date: "May 28", val: 0.52 }, { date: "May 29", val: 0.46 }, { date: "May 30", val: 0.42 },
  ];

  const trendLabels = useGoogleTrends
    ? activeTrendsData.map(d => d.date)
    : useDbTrend
      ? (dbTrendData ?? []).map(d => d.date ?? "")
      : staticTrend.map(d => d.date);

  const trendValues = useGoogleTrends
    ? activeTrendsData.map(d => d.normalized)
    : useDbTrend
      ? (dbTrendData ?? []).map(d => Number(d.sentimentScore))
      : staticTrend.map(d => d.val);

  const trendColor = activeTopic === "marriage" ? "#E24B4A" : activeTopic === "abuse" ? "#BA7517" : "#378ADD";

  const trendChart = {
    labels: trendLabels,
    datasets: [{
      label: useGoogleTrends ? "Search attention" : "Sentiment",
      data: trendValues,
      borderColor: trendColor,
      backgroundColor: trendColor + "22",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }],
  };

  const trendOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: useGoogleTrends ? 0 : -1,
        max: 1,
        ticks: {
          color: "#888",
          font: { size: 9 },
          callback: (v: any) => useGoogleTrends ? `${Math.round(v * 100)}` : (v > 0 ? `+${v}` : String(v)),
        },
        grid: { color: "rgba(128,128,128,0.1)" },
      },
      x: { ticks: { color: "#888", font: { size: 8 }, maxTicksLimit: 8 }, grid: { display: false } },
    },
  };

  // ── Bing volume bar chart ─────────────────────────────────────
  const newsVolumeChart = {
    labels: bingTrend.map(d => d.date),
    datasets: [
      { label: "Child marriage", data: bingTrend.map(d => d.marriage), backgroundColor: "rgba(226,75,74,0.7)", borderRadius: 3 },
      { label: "Abuse", data: bingTrend.map(d => d.abuse), backgroundColor: "rgba(186,117,23,0.7)", borderRadius: 3 },
      { label: "General", data: bingTrend.map(d => d.general), backgroundColor: "rgba(55,138,221,0.5)", borderRadius: 3 },
    ],
  };

  const newsVolumeOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { font: { size: 9 }, boxWidth: 8, color: "#888" } } },
    scales: {
      x: { stacked: true, ticks: { color: "#888", font: { size: 8 }, maxTicksLimit: 7 }, grid: { display: false } },
      y: { stacked: true, ticks: { color: "#888", font: { size: 9 }, stepSize: 1 }, grid: { color: "rgba(128,128,128,0.1)" } },
    },
  };

  // ── Merged feed: Netlify Fn (prod) | Alerts+Bing (dev) > DB > static ────
  const mergedLive = netlifyLive || alertsLive || bingLive;
  const liveFeedItems: any[] = netlifyLive
    ? netlifyFeed
    : [
        ...alertsItems.map((i: any) => ({ ...i, _src: "alerts" })),
        ...bingItems.filter(b => !alertsItems.some((a: any) => a.url === b.url)).map(i => ({ ...i, _src: "bing" })),
      ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const fd: any[] = mergedLive && liveFeedItems.length
    ? liveFeedItems
    : (dbFeed?.length ? dbFeed : [
        { id: 1, content: "Perkahwinan kanak-kanak mesti dihentikan — undang-undang tidak mencukupi perlindungan", sentiment: "negative", riskLevel: "high", source: "Twitter/X", region: "Kelantan", tags: "child marriage,Kelantan", engagement: "1.2K RT · 2h ago" },
        { id: 2, content: "UNICEF Malaysia: New child protection programme launched under National Strategic Plan 2020–2025", sentiment: "positive", riskLevel: "none", source: "Berita Harian", region: "National", tags: "UNICEF,policy", engagement: "National · 5h ago" },
        { id: 3, content: "Kes penganiayaan kanak-kanak di TASKA meningkat — perlu tindakan segera", sentiment: "negative", riskLevel: "high", source: "Facebook", region: "National", tags: "TASKA,JKM", engagement: "890 shares · 8h ago" },
        { id: 4, content: "Child marriages down 37% from 2019 to 2023 — Minister Nancy Shukri cites National Strategic Plan success", sentiment: "neutral", riskLevel: "none", source: "FMT", region: "National", tags: "policy progress", engagement: "National · 12h ago" },
        { id: 5, content: "KASIH Kanak-Kanak programme reaches 174,079 students in 337 schools — community response positive", sentiment: "positive", riskLevel: "none", source: "KPWKM official", region: "National", tags: "prevention", engagement: "Facebook · 24h ago" },
      ]);

  // ── Helpers ───────────────────────────────────────────────────
  const dotColor = (sentiment: string | null, risk: string | null) => {
    if (risk === "high") return "#E24B4A";
    if (sentiment === "negative") return "#E24B4A";
    if (sentiment === "positive") return "#639922";
    return "#378ADD";
  };

  const pillClass = (s: string | null, r: string | null) => {
    if (r === "high") return "pill p-hi";
    if (s === "negative") return "pill p-hi";
    if (s === "positive") return "pill p-ok";
    return "pill p-bl";
  };

  const pillText = (s: string | null, r: string | null) => {
    if (r === "high" && s === "negative") return "Negative · High risk";
    if (r === "medium") return "Negative · Monitor";
    if (s === "positive") return "Positive";
    return "Neutral · Policy";
  };

  const srcBadge = (src?: string) => {
    if (src === "alerts") return <span style={{ fontSize: 8, background: "rgba(55,138,221,0.15)", color: "#378ADD", padding: "0 4px", borderRadius: 3, marginLeft: 4, fontWeight: 600 }}>G·ALERTS</span>;
    if (src === "bing") return <span style={{ fontSize: 8, background: "rgba(99,153,34,0.15)", color: "#3B6D11", padding: "0 4px", borderRadius: 3, marginLeft: 4, fontWeight: 600 }}>BING</span>;
    return null;
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Discourse NLP monitor · BM + EN</div>
          <div className="tm">NLP pipeline · real-time sentiment & keyword extraction</div>
        </div>
        <div className="badges" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {useGoogleTrends
            ? <span className="bdg bdg-g" style={{ gap: 3 }}><Wifi size={9} />Google Trends</span>
            : <span className="bdg" style={{ background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", gap: 3 }}><WifiOff size={9} />Trends offline</span>
          }
          {netlifyLive && <span className="bdg bdg-g" style={{ gap: 3 }}><Wifi size={9} />Netlify Feed</span>}
          {!netlifyLive && bingLive && <span className="bdg bdg-g" style={{ gap: 3 }}><Wifi size={9} />Bing News</span>}
          {!netlifyLive && alertsLive && <span className="bdg bdg-g" style={{ gap: 3 }}><Wifi size={9} />G·Alerts</span>}
        </div>
      </div>

      <div className="content">
        <div className="mrow m4">
          {(mData.length ? mData : [
            { id: 1, label: "Corpus monitored (est. 7d)", value: "48.2K", subtext: "Twitter/X + Facebook BM+EN" },
            { id: 2, label: "Bahasa Melayu share", value: "71%", subtext: "Multilingual NLP pipeline" },
            { id: 3, label: "Child marriage mentions", value: "+340%", subtext: "7-day spike · Kelantan cluster", status: "critical" },
            { id: 4, label: "Overall sentiment", value: "+0.42", subtext: "−1 to +1 scale", status: "positive" },
          ]).map(m => (
            <div className="mc" key={m.id}>
              <div className="ml">{m.label}</div>
              <div className={`mv ${m.status === "critical" ? "mv-r" : m.status === "positive" ? "mv-g" : ""}`}>{m.value}</div>
              <div className="ms">{m.subtext}</div>
            </div>
          ))}
        </div>

        <div className="g2">
          {/* Trend chart */}
          <div className="card-d">
            <div className="ch">
              <div>
                <div className="ct">
                  {useGoogleTrends ? "30-day search attention · Google Trends" : "30-day sentiment trend"}
                </div>
                <div className="cs">
                  {useGoogleTrends
                    ? "MY · child marriage + penganiayaan kanak-kanak · index 0–100"
                    : "Child rights discourse · NLP pipeline"}
                  {useGoogleTrends && (
                    <span style={{ marginLeft: 6, background: "rgba(99,153,34,0.15)", color: "#3B6D11", padding: "0 5px", borderRadius: 3, fontSize: 8, fontWeight: 600 }}>LIVE</span>
                  )}
                </div>
              </div>
            </div>
            {!useGoogleTrends && (
              <div className="tab-r">
                {(["all", "marriage", "abuse"] as const).map(t => (
                  <div key={t} className={`tab ${activeTopic === t ? "on" : ""}`} onClick={() => setActiveTopic(t)}>
                    {t === "all" ? "All topics" : t === "marriage" ? "Child marriage" : "Abuse"}
                  </div>
                ))}
              </div>
            )}
            <div style={{ position: "relative", height: 140 }}>
              <Line data={trendChart} options={trendOpts} />
            </div>
            <div className="src">
              {useGoogleTrends
                ? "Source: Google Trends (unofficial scrape) · geo: MY · avg of 3 keywords · 1h cache"
                : useDbTrend
                  ? "Source: DB sentiment data · NLP pipeline"
                  : "Source: NLP pipeline · simulated on open multilingual corpus (no live source connected)"}
            </div>
          </div>

          {/* Bing volume chart */}
          <div className="card-d">
            <div className="ch">
              <div>
                <div className="ct">News attention — 14-day volume</div>
                <div className="cs">
                  Bing News · articles/day by topic
                  {bingLive && <span style={{ marginLeft: 6, background: "rgba(99,153,34,0.15)", color: "#3B6D11", padding: "0 5px", borderRadius: 3, fontSize: 8, fontWeight: 600 }}>LIVE</span>}
                </div>
              </div>
            </div>
            <div style={{ position: "relative", height: 140 }}>
              {bingTrend.length > 0 ? (
                <Bar data={newsVolumeChart} options={newsVolumeOpts} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", padding: "0 12px" }}>
                  Add BING_NEWS_API_KEY to .env to enable live news volume chart
                </div>
              )}
            </div>
            <div className="src">Source: Bing News Search API · keywords: perkahwinan kanak-kanak, child marriage, TASKA, hak kanak-kanak</div>
          </div>
        </div>

        <div className="g2">
          {/* Keyword cloud */}
          <div className="card-d">
            <div className="ch"><div><div className="ct">Keyword cloud — BM + EN</div><div className="cs">Top extracted terms this week</div></div></div>
            <div className="kw-cloud">
              {(kw.length ? kw : [
                { keyword: "perlindungan kanak-kanak", color: "#378ADD" },
                { keyword: "child marriage", color: "#E24B4A" },
                { keyword: "perkahwinan kanak-kanak", color: "#E24B4A" },
                { keyword: "JKM", color: "#378ADD" },
                { keyword: "UNICEF", color: "#639922" },
                { keyword: "kemiskinan", color: "#BA7517" },
                { keyword: "hak kanak-kanak", color: "#639922" },
                { keyword: "rumah perlindungan", color: "#BA7517" },
                { keyword: "TASKA", color: "#E24B4A" },
                { keyword: "Nancy Shukri", color: "#378ADD" },
                { keyword: "Kelantan", color: "#E24B4A" },
                { keyword: "Sabah", color: "#E24B4A" },
                { keyword: "sekolah", color: "#639922" },
                { keyword: "poverty", color: "#BA7517" },
                { keyword: "child rights", color: "#639922" },
              ]).map(k => (
                <span key={k.keyword} className="kw" style={{ background: (k.color || "#378ADD") + "22", color: k.color || "#378ADD" }}>{k.keyword}</span>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="arow ae" style={{ padding: "6px 8px", marginBottom: 6 }}>
                <TrendingUp size={12} style={{ color: "var(--color-text-danger)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>"perkahwinan kanak-kanak"</strong> — child marriage spike, Kelantan. 340% increase. High negative sentiment.</div>
              </div>
              <div className="arow aw" style={{ padding: "6px 8px" }}>
                <AlertTriangle size={12} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>"rumah perlindungan"</strong> — shelter conditions, rising concern discourse. Monitor.</div>
              </div>
            </div>
            <div className="src">Source: NLP extraction · illustrative on open corpus</div>
          </div>

          {/* Merged discourse feed */}
          <div className="card-d">
            <div className="ch">
              <div>
                <div className="ct">Classified discourse feed</div>
                <div className="cs">
                  {mergedLive
                    ? [alertsLive && "Google Alerts", bingLive && "Bing News"].filter(Boolean).join(" + ") + " · BM + EN · live"
                    : "Bahasa Melayu + English · NLP sentiment tagging"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {fd.map((item, idx) => (
                <div key={item.id ?? idx} className="fi">
                  <div className="fd" style={{ background: dotColor(item.sentiment, item.riskLevel) }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ft">
                      {item.content}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 4, color: "var(--color-text-tertiary)", verticalAlign: "middle" }}>
                          <ExternalLink size={9} />
                        </a>
                      )}
                      {srcBadge(item._src)}
                      {" "}<span className={pillClass(item.sentiment, item.riskLevel)}>{pillText(item.sentiment, item.riskLevel)}</span>
                    </div>
                    <div className="fm">
                      {item.source} · {item.region} · {item.engagement}
                      {(item.tags || "").split(",").map((t: string, i: number) => (
                        <span key={i} className="data-chip" style={{ marginLeft: 2 }}>{t.trim()}</span>
                      ))}
                    </div>
                    {item.snippet && (
                      <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 2, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                        {item.snippet}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {mergedLive && (
              <div className="src" style={{ marginTop: 6 }}>
                {[alertsLive && `Google Alerts: ${alertsItems.length} items`, bingLive && `Bing: ${bingItems.length} articles`].filter(Boolean).join(" · ")} · 30min–1h cache
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
