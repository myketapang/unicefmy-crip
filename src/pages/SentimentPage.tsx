import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, AlertTriangle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function SentimentPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "sentiment" });
  const { data: keywords } = trpc.crip.sentiment.keywords.useQuery();
  const { data: feed } = trpc.crip.sentiment.feed.useQuery();
  const [activeTopic, setActiveTopic] = useState<"all" | "marriage" | "abuse">("all");
  const { data: trendData } = trpc.crip.sentiment.trend.useQuery({ topic: activeTopic });

  const mData = metrics || [];
  const kw = keywords || [];
  const fd = feed || [];
  const trend = trendData?.length ? trendData : [
    { dayIndex: 1,  date: "May 1",  topic: activeTopic, sentimentScore: "0.42" },
    { dayIndex: 2,  date: "May 2",  topic: activeTopic, sentimentScore: "0.38" },
    { dayIndex: 3,  date: "May 3",  topic: activeTopic, sentimentScore: "0.45" },
    { dayIndex: 4,  date: "May 4",  topic: activeTopic, sentimentScore: "0.30" },
    { dayIndex: 5,  date: "May 5",  topic: activeTopic, sentimentScore: "0.15" },
    { dayIndex: 6,  date: "May 6",  topic: activeTopic, sentimentScore: "-0.10" },
    { dayIndex: 7,  date: "May 7",  topic: activeTopic, sentimentScore: "-0.32" },
    { dayIndex: 8,  date: "May 8",  topic: activeTopic, sentimentScore: "-0.48" },
    { dayIndex: 9,  date: "May 9",  topic: activeTopic, sentimentScore: "-0.55" },
    { dayIndex: 10, date: "May 10", topic: activeTopic, sentimentScore: "-0.60" },
    { dayIndex: 11, date: "May 11", topic: activeTopic, sentimentScore: "-0.52" },
    { dayIndex: 12, date: "May 12", topic: activeTopic, sentimentScore: "-0.38" },
    { dayIndex: 13, date: "May 13", topic: activeTopic, sentimentScore: "-0.20" },
    { dayIndex: 14, date: "May 14", topic: activeTopic, sentimentScore: "0.05" },
    { dayIndex: 15, date: "May 15", topic: activeTopic, sentimentScore: "0.18" },
    { dayIndex: 16, date: "May 16", topic: activeTopic, sentimentScore: "0.28" },
    { dayIndex: 17, date: "May 17", topic: activeTopic, sentimentScore: "0.35" },
    { dayIndex: 18, date: "May 18", topic: activeTopic, sentimentScore: "0.40" },
    { dayIndex: 19, date: "May 19", topic: activeTopic, sentimentScore: "0.45" },
    { dayIndex: 20, date: "May 20", topic: activeTopic, sentimentScore: "0.50" },
    { dayIndex: 21, date: "May 21", topic: activeTopic, sentimentScore: "0.42" },
    { dayIndex: 22, date: "May 22", topic: activeTopic, sentimentScore: "0.38" },
    { dayIndex: 23, date: "May 23", topic: activeTopic, sentimentScore: "0.44" },
    { dayIndex: 24, date: "May 24", topic: activeTopic, sentimentScore: "0.40" },
    { dayIndex: 25, date: "May 25", topic: activeTopic, sentimentScore: "0.36" },
    { dayIndex: 26, date: "May 26", topic: activeTopic, sentimentScore: "0.42" },
    { dayIndex: 27, date: "May 27", topic: activeTopic, sentimentScore: "0.48" },
    { dayIndex: 28, date: "May 28", topic: activeTopic, sentimentScore: "0.52" },
    { dayIndex: 29, date: "May 29", topic: activeTopic, sentimentScore: "0.46" },
    { dayIndex: 30, date: "May 30", topic: activeTopic, sentimentScore: "0.42" },
  ];

  const trendChart = {
    labels: trend.map(d => d.date || ""),
    datasets: [{
      label: "Sentiment",
      data: trend.map(d => Number(d.sentimentScore)),
      borderColor: activeTopic === "all" ? "#378ADD" : activeTopic === "marriage" ? "#E24B4A" : "#BA7517",
      backgroundColor: activeTopic === "all" ? "rgba(55,138,221,0.13)" : activeTopic === "marriage" ? "rgba(226,75,74,0.13)" : "rgba(186,117,23,0.13)",
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
      y: { min: -1, max: 1, ticks: { color: "#888", font: { size: 9 }, callback: (v: any) => v > 0 ? `+${v}` : String(v) }, grid: { color: "rgba(128,128,128,0.1)" } },
      x: { ticks: { color: "#888", font: { size: 8 }, maxTicksLimit: 8 }, grid: { display: false } },
    },
  };

  const dotColor = (sentiment: string | null, risk: string | null) => {
    if (risk === "high") return "#E24B4A";
    if (sentiment === "negative") return "#E24B4A";
    if (sentiment === "positive") return "#639922";
    return "#378ADD";
  };

  const pillClass = (sentiment: string | null, risk: string | null) => {
    if (risk === "high") return "pill p-hi";
    if (sentiment === "negative") return "pill p-hi";
    if (sentiment === "positive") return "pill p-ok";
    return "pill p-bl";
  };

  const pillText = (sentiment: string | null, risk: string | null) => {
    if (risk === "high" && sentiment === "negative") return "Negative · High risk";
    if (risk === "medium") return "Negative · Monitor";
    if (sentiment === "positive") return "Positive";
    return "Neutral · Policy";
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Discourse NLP monitor · BM + EN</div>
          <div className="tm">NLP pipeline · real-time sentiment & keyword extraction</div>
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
          <div className="card-d">
            <div className="ch"><div><div className="ct">30-day sentiment trend</div><div className="cs">Child rights discourse · NLP</div></div></div>
            <div className="tab-r">
              {(["all", "marriage", "abuse"] as const).map(t => (
                <div key={t} className={`tab ${activeTopic === t ? "on" : ""}`} onClick={() => setActiveTopic(t)}>
                  {t === "all" ? "All topics" : t === "marriage" ? "Child marriage" : "Abuse"}
                </div>
              ))}
            </div>
            <div style={{ position: "relative", height: 130 }}>
              <Line data={trendChart} options={trendOpts} />
            </div>
            <div className="src">Source: NLP pipeline · simulated on open multilingual corpus</div>
          </div>

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
        </div>

        <div className="card-d">
          <div className="ch"><div><div className="ct">Classified discourse feed — real-time</div><div className="cs">Bahasa Melayu + English · NLP sentiment tagging</div></div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(fd.length ? fd : [
              { id: 1, content: "Perkahwinan kanak-kanak mesti dihentikan — undang-undang tidak mencukupi perlindungan", sentiment: "negative", riskLevel: "high", source: "Twitter/X", region: "Kelantan", tags: "child marriage,Kelantan", engagement: "1.2K RT · 2h ago" },
              { id: 2, content: "UNICEF Malaysia: New child protection programme launched under National Strategic Plan 2020–2025", sentiment: "positive", riskLevel: "none", source: "Berita Harian", region: "National", tags: "UNICEF,policy", engagement: "National · 5h ago" },
              { id: 3, content: "Kes penganiayaan kanak-kanak di TASKA meningkat — perlu tindakan segera", sentiment: "negative", riskLevel: "high", source: "Facebook", region: "National", tags: "TASKA,JKM", engagement: "890 shares · 8h ago" },
              { id: 4, content: "Child marriages down 37% from 2019 to 2023 — Minister Nancy Shukri cites National Strategic Plan success", sentiment: "neutral", riskLevel: "none", source: "FMT", region: "National", tags: "policy progress", engagement: "National · 12h ago" },
              { id: 5, content: "KASIH Kanak-Kanak programme reaches 174,079 students in 337 schools — community response positive", sentiment: "positive", riskLevel: "none", source: "KPWKM official", region: "National", tags: "prevention", engagement: "Facebook · 24h ago" },
            ]).map(item => (
              <div key={item.id} className="fi">
                <div className="fd" style={{ background: dotColor(item.sentiment, item.riskLevel) }}></div>
                <div>
                  <div className="ft">{item.content} <span className={pillClass(item.sentiment, item.riskLevel)}>{pillText(item.sentiment, item.riskLevel)}</span></div>
                  <div className="fm">{item.source} · {item.region} · {item.engagement} · {(item.tags || "").split(",").map((t, i) => <span key={i} className="data-chip" style={{ marginLeft: 2 }}>{t}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
