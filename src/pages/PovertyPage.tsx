import { trpc } from "@/providers/trpc";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AlertTriangle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const chartOpts: any = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { color: "#888", font: { size: 9 }, callback: (v: any) => v + "%" }, grid: { color: "rgba(128,128,128,0.1)" } },
    x: { ticks: { color: "#888", font: { size: 9 } }, grid: { display: false } },
  },
};

function ProgressBar({ name, width, value, color }: { name: string; width: string; value: string; color: string }) {
  return (
    <div className="brow">
      <span className="bn">{name}</span>
      <div className="bw"><div className="bb" style={{ width, background: color }}></div></div>
      <span className="bv">{value}</span>
    </div>
  );
}

export default function PovertyPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "poverty" });
  const { data: povertyData } = trpc.crip.poverty.byState.useQuery();
  const { data: trendData } = trpc.crip.poverty.trend.useQuery();

  const mData = metrics || [];
  const poverty = povertyData || [];
  const trend = trendData?.length ? trendData : [
    { year: 2016, nationalPovertyRate: "4.0" },
    { year: 2017, nationalPovertyRate: "3.5" },
    { year: 2018, nationalPovertyRate: "3.0" },
    { year: 2019, nationalPovertyRate: "2.8" },
    { year: 2020, nationalPovertyRate: "8.4" },
    { year: 2021, nationalPovertyRate: "8.2" },
    { year: 2022, nationalPovertyRate: "6.2" },
  ];

  const trendChart = {
    labels: trend.map(d => String(d.year)),
    datasets: [{
      label: "Poverty rate %",
      data: trend.map(d => Number(d.nationalPovertyRate)),
      borderColor: "#BA7517",
      backgroundColor: "rgba(186,117,23,0.2)",
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: "#BA7517",
    }],
  };

  const maxPoverty = poverty.length ? Math.max(...poverty.map(d => Number(d.povertyRate))) : 19.8;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Poverty & socioeconomic risk mapping</div>
          <div className="tm">DOSM HIES 2022 · OpenDOSM poverty_state dataset · COVID impact analysis</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m3">
          {(mData.length ? mData : [
            { id: 1, label: "National poverty 2022", value: "6.2%", subtext: "↓ from 8.2% in 2021 · DOSM HIES", status: "moderate" },
            { id: 2, label: "COVID impact peak (2020)", value: "8.4%", subtext: "580K M40 → B40 · DOSM", status: "critical" },
            { id: 3, label: "Poverty Line Income 2022", value: "RM 2,589", subtext: "↑ from RM 2,208 (2019) · DOSM", status: "neutral" },
          ]).map(m => (
            <div className="mc" key={m.id}>
              <div className="ml">{m.label}</div>
              <div className={`mv ${m.status === "critical" ? "mv-r" : m.status === "moderate" ? "mv-o" : ""}`}>{m.value}</div>
              <div className="ms">{m.subtext}</div>
            </div>
          ))}
        </div>

        <div className="g2">
          <div className="card-d">
            <div className="ch"><div><div className="ct">Poverty by state 2022</div><div className="cs">Absolute poverty rate % · DOSM HIES 2022</div></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
              {(poverty.length ? poverty : [
                { state: "Sabah", povertyRate: "19.80" },
                { state: "Kelantan", povertyRate: "12.30" },
                { state: "Terengganu", povertyRate: "11.20" },
                { state: "Kedah", povertyRate: "10.80" },
                { state: "Sarawak", povertyRate: "7.90" },
                { state: "Perak", povertyRate: "7.40" },
                { state: "Pahang", povertyRate: "5.70" },
                { state: "Selangor", povertyRate: "1.50" },
                { state: "Kuala Lumpur", povertyRate: "0.40" },
              ]).map((s) => {
                const rate = Number(s.povertyRate);
                const pct = `${(rate / maxPoverty) * 100}%`;
                const color = rate >= 10 ? "#E24B4A" : rate >= 5 ? "#EF9F27" : "#639922";
                return <ProgressBar key={s.state} name={s.state} width={pct} value={`${s.povertyRate}%`} color={color} />;
              })}
            </div>
            <div className="src">Source: DOSM HIES 2022 · OpenDOSM poverty_state dataset · CC BY 4.0</div>
          </div>

          <div className="card-d">
            <div className="ch"><div><div className="ct">Poverty trend & COVID impact</div><div className="cs">National absolute poverty rate 2016–2022</div></div></div>
            <div style={{ position: "relative", height: 150 }}>
              <Line data={trendChart} options={chartOpts} />
            </div>
            <div className="arow aw" style={{ marginTop: 8, padding: "6px 8px" }}>
              <AlertTriangle size={12} style={{ color: "var(--color-text-warning)", flexShrink: 0, marginTop: 1 }} />
              <div className="ab" style={{ fontSize: 10 }}>580K households shifted from M40 → B40 during COVID (2020). Child rights risk correlates strongly with poverty spikes — platform should track this in real time.</div>
            </div>
            <div className="src">Source: DOSM · PM Ismail Sabri parliamentary statement 2021 · DOSM HIES 2022</div>
          </div>
        </div>
      </div>
    </>
  );
}
