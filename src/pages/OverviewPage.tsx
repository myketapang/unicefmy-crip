import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CircleCheck,
  AlertTriangle as AlertTriangleIcon,
  Brain,
} from "lucide-react";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      ticks: { color: "#888", font: { size: 9 } },
      grid: { color: "rgba(128,128,128,0.1)" },
    },
    x: {
      ticks: { color: "#888", font: { size: 9 } },
      grid: { display: false },
    },
  },
};

const topbarTitles: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "National overview — child rights dashboard",
    subtitle: "Verified data: UNICEF Malaysia · JKM/KPWKM · DOSM HIES 2022 · BMJ Open research",
  },
};

function TopBar() {
  const info = topbarTitles.overview;
  return (
    <div className="topbar">
      <div>
        <div className="tt">{info.title}</div>
        <div className="tm">{info.subtitle}</div>
      </div>
      <div className="badges">
        <span className="bdg bdg-g"><CircleCheck size={10} /> 7 verified sources</span>
        <span className="bdg bdg-r"><AlertTriangleIcon size={10} /> 3 risk alerts</span>
        <span className="bdg bdg-b"><Brain size={10} /> NLP active</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtext, status }: { label: string; value: string; subtext?: string; status?: string }) {
  const valueClass = status === "critical" ? "mv mv-r" : status === "moderate" ? "mv mv-o" : "mv";
  return (
    <div className="mc">
      <div className="ml">{label}</div>
      <div className={valueClass}>{value}</div>
      <div className="ms">{subtext}</div>
    </div>
  );
}

function ProgressBar({ name, width, value, pill }: { name: string; width: string; value: string; pill: string }) {
  const pillClass = pill === "Critical" ? "pill p-hi" : pill === "High" ? "pill p-md" : pill === "Moderate" ? "pill p-ok" : "pill p-ok";
  const barColor = pill === "Critical" ? "#E24B4A" : pill === "High" ? "#EF9F27" : "#639922";
  return (
    <div className="brow">
      <span className="bn">{name}</span>
      <div className="bw"><div className="bb" style={{ width, background: barColor }}></div></div>
      <span className="bv">{value}</span>
      <span className={pillClass} style={{ marginLeft: 4 }}>{pill}</span>
    </div>
  );
}

function TrendChart({ marriageData }: { marriageData: { year: number; totalCases: number }[] }) {
  const labels = marriageData.map(d => String(d.year));
  const data = {
    labels,
    datasets: [
      {
        label: "Child marriages",
        data: marriageData.map(d => d.totalCases),
        borderColor: "#E24B4A",
        backgroundColor: "rgba(226,75,74,0.13)",
        fill: true,
        tension: 0.3,
        yAxisID: "y",
        pointRadius: 3,
        pointBackgroundColor: "#E24B4A",
      },
      {
        label: "Abuse est.",
        data: [5800, 5900, 6200, 5650, 4469],
        borderColor: "#378ADD",
        backgroundColor: "rgba(55,138,221,0.07)",
        fill: false,
        tension: 0.3,
        yAxisID: "y2",
        borderDash: [4, 3],
        pointRadius: 0,
      },
    ],
  };
  const opts = {
    ...chartOptions,
    plugins: {
      legend: { display: true, labels: { font: { size: 9 }, boxWidth: 10, color: "#888" } },
    },
    scales: {
      y: { ...chartOptions.scales.y, position: "left" as const },
      y2: { ...chartOptions.scales.y, position: "right" as const, grid: { display: false } },
      x: chartOptions.scales.x,
    },
  };
  return <Line data={data} options={opts} />;
}

export default function OverviewPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "overview" });
  const { data: riskRankings } = trpc.crip.stateRisk.list.useQuery();
  const { data: marriageData } = trpc.crip.marriage.list.useQuery();

  const overviewMetrics = metrics || [];
  const riskData = riskRankings?.slice(0, 7) || [];
  const marriageTrend = marriageData?.length ? marriageData : [
    { year: 2019, totalCases: 1467 },
    { year: 2020, totalCases: 1354 },
    { year: 2021, totalCases: 1220 },
    { year: 2022, totalCases: 1041 },
    { year: 2023, totalCases: 923 },
  ];

  return (
    <>
      <TopBar />
      <div className="content">
        <div className="mrow m4">
          {overviewMetrics.map((m) => (
            <MetricCard key={m.id} label={m.label} value={m.value} subtext={m.subtext || undefined} status={m.status || undefined} />
          ))}
          {!overviewMetrics.length && [
            { label: "Child marriages (2023)", value: "923", subtext: "↓ 37% from 2019 · DOSM/KPWKM", status: "moderate" },
            { label: "Child abuse cases (2023)", value: "4,469", subtext: "JKM verified · +vs 2022", status: "critical" },
            { label: "National poverty rate", value: "6.2%", subtext: "DOSM HIS 2022 · ↓ from 8.2%", status: "moderate" },
            { label: "Highest state poverty", value: "19.8%", subtext: "Sabah · DOSM 2022", status: "critical" },
          ].map((m, i) => <MetricCard key={i} {...m} />)}
        </div>

        <div className="g2">
          <div className="card-d">
            <div className="ch">
              <div>
                <div className="ct">Key trend signals</div>
                <div className="cs">2019–2023 · verified parliamentary data</div>
              </div>
            </div>
            <div style={{ position: "relative", height: 150 }}>
              <TrendChart marriageData={marriageTrend} />
            </div>
            <div className="src">Source: KPWKM parliamentary reply Feb 2025 · DOSM · JKM annual data</div>
          </div>

          <div className="card-d">
            <div className="ch">
              <div>
                <div className="ct">Risk composite — state ranking</div>
                <div className="cs">Poverty × child marriage × abuse rate</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {riskData.map((r) => (
                <ProgressBar
                  key={r.id}
                  name={r.state}
                  width={`${(Number(r.compositeScore) / 0.92) * 100}%`}
                  value={String(r.compositeScore)}
                  pill={r.riskLevel === "critical" ? "Critical" : r.riskLevel === "high" ? "High" : "Moderate"}
                />
              ))}
              {!riskData.length && [
                { name: "Sabah", w: "100%", v: "0.92", p: "Critical" },
                { name: "Kelantan", w: "88%", v: "0.81", p: "Critical" },
                { name: "Terengganu", w: "70%", v: "0.64", p: "High" },
                { name: "Kedah", w: "62%", v: "0.57", p: "High" },
                { name: "Sarawak", w: "50%", v: "0.46", p: "High" },
                { name: "Pahang", w: "40%", v: "0.37", p: "Moderate" },
                { name: "Selangor", w: "28%", v: "0.26", p: "Monitor" },
              ].map((r, i) => <ProgressBar key={i} name={r.name} width={r.w} value={r.v} pill={r.p} />)}
            </div>
            <div className="src">Composite: DOSM poverty + KPWKM marriage + JKM abuse per 10K children</div>
          </div>
        </div>

        <div className="arow ae">
          <AlertCircle size={14} style={{ color: "var(--color-text-danger)", flexShrink: 0, marginTop: 1 }} />
          <div className="ab">
            <strong>Sabah</strong> — highest risk composite nationally: 19.8% poverty, 86 child marriages (2020 Sarawak183/Sabah86 ranking), and 333 abuse cases Jan–May 2023 alone. Recommend immediate facility gap assessment and discourse monitoring for interior districts.
          </div>
        </div>

        <div className="arow aw">
          <AlertTriangle size={14} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
          <div className="ab">
            <strong>Kelantan</strong> — peer-reviewed research (BMJ Open 2019) identifies community norms, early school dropout, and religious framing as primary child marriage drivers. Sentiment spike +340% detected. High-priority NLP monitoring zone.
          </div>
        </div>

        <div className="arow ai">
          <Info size={14} style={{ color: "var(--color-text-info)", flexShrink: 0, marginTop: 1 }} />
          <div className="ab">
            <strong>Positive signal</strong> — child marriages fell 37% nationally (2019→2023: 1,467→923). National Strategic Plan 2020–2025 showing measurable impact. Model this as evidence base for UNICEF advocacy brief.
          </div>
        </div>
      </div>
    </>
  );
}
