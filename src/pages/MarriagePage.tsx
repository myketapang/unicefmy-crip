import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { BookOpen, Users, Coins, Gavel } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { ticks: { color: "#888", font: { size: 9 } }, grid: { color: "rgba(128,128,128,0.1)" } }, x: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false } } },
};

function ProgressBar({ name, width, value, pill, color }: { name: string; width: string; value: string; pill: string; color: string }) {
  const pillClass = pill === "Highest" ? "pill p-hi" : pill === "Critical" ? "pill p-hi" : "pill p-md";
  return (
    <div className="brow">
      <span className="bn">{name}</span>
      <div className="bw"><div className="bb" style={{ width, background: color }}></div></div>
      <span className="bv">{value}</span>
      <span className={pillClass} style={{ marginLeft: 4 }}>{pill}</span>
    </div>
  );
}

export default function MarriagePage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "marriage" });
  const { data: marriageData } = trpc.crip.marriage.list.useQuery();
  const { data: riskData } = trpc.crip.stateRisk.list.useQuery();

  const mData = metrics || [];
  const marData = marriageData?.length ? marriageData : [
    { year: 2019, totalCases: 1467, bumiputera: null, chinese: null, indian: null, others: null },
    { year: 2020, totalCases: 1354, bumiputera: 1233, chinese: 63, indian: 12, others: 46 },
    { year: 2021, totalCases: 1220, bumiputera: null, chinese: null, indian: null, others: null },
    { year: 2022, totalCases: 1041, bumiputera: null, chinese: null, indian: null, others: null },
    { year: 2023, totalCases: 923, bumiputera: null, chinese: null, indian: null, others: null },
  ];
  const dropoutData = riskData?.filter(r => r.dropoutMarriages).sort((a, b) => (b.dropoutMarriages || 0) - (a.dropoutMarriages || 0)) || [];

  const ethData = marData.find(d => d.year === 2020);
  const ethChartData = {
    labels: ["Bumiputera", "Chinese", "Indian", "Others"],
    datasets: [{
      data: [ethData?.bumiputera || 1233, ethData?.chinese || 63, ethData?.indian || 12, ethData?.others || 46],
      backgroundColor: ["#378ADD", "#639922", "#BA7517", "#888780"],
      borderWidth: 1,
      borderColor: "var(--color-background-primary)",
    }],
  };

  const lineData = {
    labels: marData.map(d => String(d.year)),
    datasets: [{
      label: "Child marriages", data: marData.map(d => d.totalCases),
      borderColor: "#E24B4A", backgroundColor: "rgba(226,75,74,0.2)",
      fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: "#E24B4A",
    }],
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Child marriage analysis · 2007–2023</div>
          <div className="tm">Verified parliamentary data · KPWKM/DOSM · BMJ Open research</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m4">
          {(mData.length ? mData : [
            { id: 1, label: "2019 (baseline)", value: "1,467", subtext: "DOSM/KPWKM", status: "neutral" },
            { id: 2, label: "2023 (latest)", value: "923", subtext: "↓ 37% from baseline", status: "positive" },
            { id: 3, label: "2007–2017 total", value: "15,000", subtext: "UNICEF advocacy brief", status: "critical" },
            { id: 4, label: "Bumiputera share (2020)", value: "91%", subtext: "1,233 of 1,354 · KPWKM", status: "neutral" },
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
            <div className="ch"><div><div className="ct">Child marriages 2019–2023</div><div className="cs">Verified parliamentary data · KPWKM/DOSM</div></div></div>
            <div style={{ position: "relative", height: 165 }}>
              <Line data={lineData} options={chartOpts} />
            </div>
            <div className="src">Source: Minister Nancy Shukri, parliamentary reply, Feb 2025 · FMT/NST</div>
          </div>
          <div className="card-d">
            <div className="ch"><div><div className="ct">Ethnicity breakdown (2020)</div><div className="cs">1,354 total · KPWKM parliamentary data</div></div></div>
            <div style={{ position: "relative", height: 165 }}>
              <Doughnut data={ethChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "right" as const, labels: { font: { size: 9 }, boxWidth: 10, color: "#888" } } } }} />
            </div>
            <div className="src">Source: KPWKM parliamentary reply May 2023 · Galen Centre</div>
          </div>
        </div>

        <div className="g2">
          <div className="card-d">
            <div className="ch"><div><div className="ct">High-risk states — 2020 dropout+marriage</div><div className="cs">School dropouts to marry · JKSM data</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
              {(dropoutData.length ? dropoutData : [
                { state: "Sarawak", dropoutMarriages: 183 },
                { state: "Sabah", dropoutMarriages: 86 },
                { state: "Kelantan", dropoutMarriages: 43 },
                { state: "Pahang", dropoutMarriages: 38 },
              ]).map((d, i, arr) => {
                const max = arr[0]?.dropoutMarriages || 183;
                const pct = max ? `${((d.dropoutMarriages || 0) / max) * 100}%` : "0%";
                const pill = i === 0 ? "Highest" : i <= 1 ? "Critical" : "High";
                const color = i <= 1 ? "#E24B4A" : "#EF9F27";
                return <ProgressBar key={d.state} name={d.state} width={pct} value={String(d.dropoutMarriages || 0)} pill={pill} color={color} />;
              })}
            </div>
            <div className="src">Source: Idris Ahmad (Religious Affairs), parliamentary statement 2021 · SWWS petition data</div>
          </div>
          <div className="card-d">
            <div className="ch"><div><div className="ct">BMJ Open risk factors — Kelantan study</div><div className="cs">Qualitative research · peer-reviewed 2019</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              <div className="arow aw" style={{ padding: "6px 8px", margin: 0 }}>
                <BookOpen size={12} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>Education poverty</strong> — school dropout seen as marriage trigger; families prioritise marriage over girls' schooling</div>
              </div>
              <div className="arow aw" style={{ padding: "6px 8px", margin: 0 }}>
                <Users size={12} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>Community norms</strong> — religious and cultural framing normalises early marriage in East Coast states</div>
              </div>
              <div className="arow aw" style={{ padding: "6px 8px", margin: 0 }}>
                <Coins size={12} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>Economic pressure</strong> — B40 households in Kelantan, Sabah, Sarawak use marriage to reduce financial burden</div>
              </div>
              <div className="arow ai" style={{ padding: "6px 8px", margin: 0 }}>
                <Gavel size={12} style={{ color: "var(--color-text-info)", flexShrink: 0, marginTop: 1 }} />
                <div className="ab" style={{ fontSize: 10 }}><strong>Legal gap</strong> — syariah court applications remain high (2,098 cases Sep 2018–Oct 2021) despite SOP tightening</div>
              </div>
            </div>
            <div className="src">Source: BMJ Open (2019) · PMC6731912 · Nakayama et al. · Kyoto University / Malaysia study</div>
          </div>
        </div>
      </div>
    </>
  );
}
