import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function FacilitiesPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "facilities" });
  const { data: facilities } = trpc.crip.facilities.list.useQuery();

  const mData = metrics || [];
  const fac = facilities?.length ? facilities : [
    { state: "Sabah", povertyRate: "19.8", facilityCount: 18, priority: "P1" as const, interventionNotes: "Poverty 19.8% · 86 child marriages · 333 abuse cases" },
    { state: "Kelantan", povertyRate: "12.3", facilityCount: 12, priority: "P1" as const, interventionNotes: "Poverty 12.3% · BMJ risk factors · marriage spike" },
    { state: "Sarawak", povertyRate: "7.9", facilityCount: 22, priority: "P1" as const, interventionNotes: "Highest marriage dropouts (183) · facility gap" },
    { state: "Terengganu", povertyRate: "11.2", facilityCount: 15, priority: "P2" as const, interventionNotes: "Poverty 11.2% · East Coast cluster" },
    { state: "Kedah", povertyRate: "10.8", facilityCount: 20, priority: "P2" as const, interventionNotes: "Poverty 10.8% · North cluster" },
    { state: "Selangor", povertyRate: "1.5", facilityCount: 68, priority: "P3" as const, interventionNotes: "High abuse volume · good facility base" },
  ];

  const facChart = {
    labels: fac.map(d => d.state),
    datasets: [
      { label: "Poverty rate %", data: fac.map(d => Number(d.povertyRate)), backgroundColor: "rgba(226,75,74,0.53)", borderRadius: 3, yAxisID: "y" },
      { label: "Facilities (est.)", data: fac.map(d => d.facilityCount), backgroundColor: "rgba(55,138,221,0.53)", borderRadius: 3, yAxisID: "y2" },
    ],
  };

  const facOpts: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { font: { size: 9 }, boxWidth: 8, color: "#888" } } },
    scales: {
      y: { ticks: { color: "#888", font: { size: 9 }, callback: (v: any) => v + "%" }, grid: { color: "rgba(128,128,128,0.1)" }, position: "left" },
      y2: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false }, position: "right" },
      x: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false } },
    },
  };

  const p1Cards = fac.filter(f => f.priority === "P1");
  const p2Cards = fac.filter(f => f.priority === "P2");
  const p3Cards = fac.filter(f => f.priority === "P3");

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Care facilities · gap & priority analysis</div>
          <div className="tm">JKM registry · Child protection teams · KASIH programme coverage</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m4">
          {(mData.length ? mData : [
            { id: 1, label: "JKM registered facilities", value: "312", subtext: "Institusi Kanak-Kanak", status: "neutral" },
            { id: 2, label: "Child protection teams", value: "140", subtext: "Active nationwide · JKM 2023", status: "positive" },
            { id: 3, label: "Child welfare teams", value: "133", subtext: "JKM ministry statement", status: "positive" },
            { id: 4, label: "KASIH prog. reach (2024)", value: "174K", subtext: "Students · 337 schools", status: "positive" },
          ]).map(m => (
            <div className="mc" key={m.id}>
              <div className="ml">{m.label}</div>
              <div className={`mv ${m.status === "positive" ? "mv-g" : ""}`}>{m.value}</div>
              <div className="ms">{m.subtext}</div>
            </div>
          ))}
        </div>

        <div className="g2">
          <div className="card-d">
            <div className="ch"><div><div className="ct">Facility coverage gap analysis</div><div className="cs">Poverty risk vs registered facilities · composite</div></div></div>
            <div style={{ position: "relative", height: 200 }}>
              <Bar data={facChart} options={facOpts} />
            </div>
            <div className="src">Source: JKM registry estimates · DOSM HIES 2022 · cross-referenced</div>
          </div>

          <div className="card-d">
            <div className="ch"><div><div className="ct">Platform intervention map</div><div className="cs">Priority zones for Phase 1 deployment</div></div></div>
            <div className="risk-grid">
              {(p1Cards.length ? p1Cards : [
                { state: "Sabah interior", priority: "P1", interventionNotes: "Poverty 19.8% · 86 child marriages · 333 abuse cases" },
                { state: "Kelantan", priority: "P1", interventionNotes: "Poverty 12.3% · BMJ risk factors · marriage spike" },
                { state: "Sarawak rural", priority: "P1", interventionNotes: "Highest marriage dropouts (183) · facility gap" },
              ]).map((f, i) => (
                <div key={i} className={`rcard rcard-${f.priority === "P1" ? "hi" : f.priority === "P2" ? "md" : "ok"}`}>
                  <div className="rl">{f.state}</div>
                  <div className="rv">{f.priority}</div>
                  <div className="rs">{f.interventionNotes}</div>
                </div>
              ))}
              {(p2Cards.length ? p2Cards : [
                { state: "Terengganu", priority: "P2", interventionNotes: "Poverty 11.2% · East Coast cluster" },
                { state: "Kedah", priority: "P2", interventionNotes: "Poverty 10.8% · North cluster" },
              ]).map((f, i) => (
                <div key={`p2-${i}`} className="rcard rcard-md">
                  <div className="rl">{f.state}</div>
                  <div className="rv">{f.priority}</div>
                  <div className="rs">{f.interventionNotes}</div>
                </div>
              ))}
              {(p3Cards.length ? p3Cards : [
                { state: "Selangor", priority: "P3", interventionNotes: "High abuse volume · good facility base" },
              ]).map((f, i) => (
                <div key={`p3-${i}`} className="rcard rcard-ok">
                  <div className="rl">{f.state}</div>
                  <div className="rv">{f.priority}</div>
                  <div className="rs" style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{f.interventionNotes}</div>
                </div>
              ))}
            </div>
            <div className="src">Source: Composite risk model · JKM + DOSM + KPWKM + BMJ Open research</div>
          </div>
        </div>
      </div>
    </>
  );
}
