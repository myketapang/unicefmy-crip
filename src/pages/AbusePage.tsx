import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AlertCircle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts: any = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { ticks: { color: "#888", font: { size: 9 } }, grid: { color: "rgba(128,128,128,0.1)" } }, x: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false } } },
};

const chartOptsPct: any = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: true, labels: { font: { size: 9 }, boxWidth: 8, color: "#888" } } },
  scales: { y: { max: 100, ticks: { color: "#888", font: { size: 9 }, callback: (v: any) => v + "%" }, grid: { color: "rgba(128,128,128,0.1)" } }, x: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false } } },
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

export default function AbusePage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "abuse" });
  const { data: abuseData } = trpc.crip.abuse.list.useQuery();
  const { data: stateData } = trpc.crip.abuse.byState.useQuery();
  const { data: taskaData } = trpc.crip.abuse.taska.useQuery();

  const mData = metrics || [];
  const abuse = abuseData?.length ? abuseData : [
    { year: 2019, totalCases: 5800, sexualCrimesPDRM: null },
    { year: 2020, totalCases: 5900, sexualCrimesPDRM: null },
    { year: 2021, totalCases: 6200, sexualCrimesPDRM: null },
    { year: 2022, totalCases: 5650, sexualCrimesPDRM: null },
    { year: 2023, totalCases: 4469, sexualCrimesPDRM: 5401 },
  ];
  const states = stateData || [];
  const taska = taskaData?.length ? taskaData : [
    { year: 2020, abuseCases: 8, deaths: 1 },
    { year: 2021, abuseCases: 12, deaths: 2 },
    { year: 2022, abuseCases: 15, deaths: 1 },
    { year: 2023, abuseCases: 18, deaths: 2 },
    { year: 2024, abuseCases: 22, deaths: 4 },
  ];

  const abuseByYear = {
    labels: abuse.map(d => d.year === 2024 ? "2024 (Jan–Aug)" : String(d.year)),
    datasets: [{
      label: "Cases",
      data: abuse.map(d => d.totalCases),
      backgroundColor: abuse.map((_, i) => i === 3 ? "#E24B4A" : i === 4 ? "#EF9F27" : "#378ADD"),
      borderRadius: 4,
    }],
  };

  const abuseByType = {
    labels: ["Physical", "Sexual", "Emotional"],
    datasets: [
      { label: "Girls", data: [45, 92.3, 65], backgroundColor: "#D4537E", borderRadius: 3 },
      { label: "Boys", data: [55, 7.7, 35], backgroundColor: "#378ADD", borderRadius: 3 },
    ],
  };

  const taskaChart = {
    labels: taska.map(d => String(d.year)),
    datasets: [
      { label: "Abuse", data: taska.map(d => d.abuseCases), backgroundColor: "#E24B4A", borderRadius: 3 },
      { label: "Deaths", data: taska.map(d => d.deaths), backgroundColor: "#791F1F", borderRadius: 3 },
    ],
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Child abuse & neglect · JKM/KPWKM verified data</div>
          <div className="tm">Verified government data · KPWKM parliamentary replies · Galen Centre</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m4">
          {(mData.length ? mData : [
            { id: 1, label: "2020–2022 total (JKM)", value: "18,750", subtext: "Physical + sexual + emotional + neglect", status: "critical" },
            { id: 2, label: "2023 full year (JKM)", value: "4,469", subtext: "KPWKM Dec 2024 report", status: "critical" },
            { id: 3, label: "Sexual crimes vs children (PDRM 2023)", value: "5,401", subtext: "Royal Malaysian Police", status: "critical" },
            { id: 4, label: "Girls: sexual abuse share", value: "92.3%", subtext: "2023 · KPWKM breakdown", status: "critical" },
          ]).map(m => (
            <div className="mc" key={m.id}>
              <div className="ml">{m.label}</div>
              <div className={`mv ${m.status === "critical" ? "mv-r" : ""}`}>{m.value}</div>
              <div className="ms">{m.subtext}</div>
            </div>
          ))}
        </div>

        <div className="g3b">
          <div className="card-d">
            <div className="ch"><div><div className="ct">Abuse cases by year — JKM reported</div><div className="cs">Verified government data · KPWKM parliamentary replies</div></div></div>
            <div style={{ position: "relative", height: 165 }}>
              <Bar data={abuseByYear} options={chartOpts} />
            </div>
            <div className="src">Source: KPWKM (Nancy Shukri) parliamentary replies · Galen Centre · Dec 2024</div>
          </div>
          <div className="card-d">
            <div className="ch"><div><div className="ct">Abuse type × gender</div><div className="cs">2023 · JKM breakdown</div></div></div>
            <div style={{ position: "relative", height: 165 }}>
              <Bar data={abuseByType} options={chartOptsPct} />
            </div>
            <div className="src">Source: KPWKM Dec 2024 parliamentary data</div>
          </div>
        </div>

        <div className="g2">
          <div className="card-d">
            <div className="ch"><div><div className="ct">Abuse by state — Jan–May 2023 (JKM)</div><div className="cs">Top reporting states · FMT/JKM Sep 2023</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
              {(states.length ? states : [
                { state: "Selangor", cases: 647, riskLevel: "highest" },
                { state: "Sabah", cases: 333, riskLevel: "critical" },
                { state: "KL", cases: 326, riskLevel: "critical" },
                { state: "Johor", cases: 220, riskLevel: "high" },
                { state: "Perak", cases: 181, riskLevel: "high" },
                { state: "Kelantan", cases: 143, riskLevel: "monitor" },
              ]).map((s, _i, arr) => {
                const max = arr[0]?.cases || 647;
                const pct = `${((s.cases / max) * 100)}%`;
                const pill = s.riskLevel === "highest" ? "Highest" : s.riskLevel === "critical" ? "Critical" : s.riskLevel === "high" ? "High" : "Monitor";
                const color = s.riskLevel === "highest" || s.riskLevel === "critical" ? "#E24B4A" : "#EF9F27";
                return <ProgressBar key={s.state} name={s.state} width={pct} value={String(s.cases)} pill={pill} color={color} />;
              })}
            </div>
            <div className="src">Source: JKM ministry statement Sep 2023 · FMT · 140 child protection teams active</div>
          </div>
          <div className="card-d">
            <div className="ch"><div><div className="ct">Care centre abuse (TASKA) 2020–2024</div><div className="cs">Licensed facility enforcement · JKM</div></div></div>
            <div style={{ position: "relative", height: 130 }}>
              <Bar data={taskaChart} options={{ ...chartOpts, plugins: { legend: { display: true, labels: { font: { size: 9 }, boxWidth: 8, color: "#888" } } } }} />
            </div>
            <div className="arow ae" style={{ marginTop: 8, padding: "6px 8px" }}>
              <AlertCircle size={12} style={{ color: "var(--color-text-danger)", flexShrink: 0, marginTop: 1 }} />
              <div className="ab" style={{ fontSize: 10 }}>4 child deaths at TASKA in 2024 alone — highest in 5-year period. Facility oversight flagged as critical gap.</div>
            </div>
            <div className="src">Source: KPWKM Feb 2025 · Galen Centre report</div>
          </div>
        </div>
      </div>
    </>
  );
}
