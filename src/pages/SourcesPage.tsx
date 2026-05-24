import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { CircleCheck, Database, BookOpen, AlertTriangle, Sparkles, ExternalLink, Trash2, Plus } from "lucide-react";

const statusConfig: Record<string, { icon: typeof CircleCheck; className: string }> = {
  live: { icon: CircleCheck, className: "p-ok" },
  live_api: { icon: Database, className: "p-ok" },
  verified: { icon: CircleCheck, className: "p-ok" },
  reference: { icon: BookOpen, className: "p-bl" },
  academic: { icon: BookOpen, className: "p-bl" },
  supplementary: { icon: AlertTriangle, className: "p-md" },
  prototype: { icon: Sparkles, className: "p-md" },
};

export default function SourcesPage() {
  const { data: metrics } = trpc.crip.metrics.list.useQuery({ module: "sources" });
  const { data: sources, refetch } = trpc.crip.sources.list.useQuery();
  const { data: authUser } = trpc.auth.me.useQuery();
  const isAdmin = authUser?.role === "admin";

  const [showAdd, setShowAdd] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", category: "", description: "", sourceUrl: "" });

  const createMutation = trpc.crip.sources.create.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); setNewSource({ name: "", category: "", description: "", sourceUrl: "" }); } });
  const deleteMutation = trpc.crip.sources.delete.useMutation({ onSuccess: () => refetch() });

  const mData = metrics || [];
  const src = sources || [];

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Data source registry · {src.length || 7} verified sources</div>
          <div className="tm">JKM · DOSM · KPWKM · UNICEF MY · BMJ Open · PDRM · NarrativeGPT</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m3">
          {(mData.length ? mData : [
            { id: 1, label: "Verified data sources", value: String(src.length || 7), subtext: "Active in this platform", status: "positive" },
            { id: 2, label: "Data points ingested", value: "2,400+", subtext: "Across all modules" },
            { id: 3, label: "Update frequency", value: "Annual+", subtext: "Parliamentary · Periodic surveys" },
          ]).map(m => (
            <div className="mc" key={m.id}>
              <div className="ml">{m.label}</div>
              <div className={`mv ${m.status === "positive" ? "mv-g" : ""}`}>{m.value}</div>
              <div className="ms">{m.subtext}</div>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
            {!showAdd ? (
              <button onClick={() => setShowAdd(true)} className="ni on" style={{ width: "auto", display: "inline-flex" }}>
                <Plus size={12} /> Add Source
              </button>
            ) : (
              <div className="card-d" style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input placeholder="Source name" value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} style={{ flex: 1, minWidth: 150, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }} />
                  <input placeholder="Category" value={newSource.category} onChange={e => setNewSource({ ...newSource, category: e.target.value })} style={{ flex: 1, minWidth: 120, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }} />
                  <input placeholder="Description" value={newSource.description} onChange={e => setNewSource({ ...newSource, description: e.target.value })} style={{ flex: 2, minWidth: 200, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }} />
                  <input placeholder="URL" value={newSource.sourceUrl} onChange={e => setNewSource({ ...newSource, sourceUrl: e.target.value })} style={{ flex: 1, minWidth: 150, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }} />
                  <button onClick={() => createMutation.mutate({ ...newSource, status: "reference" })} className="ni on" style={{ width: "auto" }}>Save</button>
                  <button onClick={() => setShowAdd(false)} className="ni" style={{ width: "auto" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(src.length ? src : []).map((s) => {
            const cfg = statusConfig[s.status || "reference"] || statusConfig.reference;
            const Icon = cfg.icon;
            return (
              <div key={s.id} className="card-d">
                <div className="ch">
                  <div>
                    <div className="ct">{s.name}</div>
                    <div className="cs">{s.category}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className={`pill ${cfg.className}`}><Icon size={8} style={{ display: "inline", marginRight: 2 }} />{(s.status || "reference").replace("_", " ")}</span>
                    {isAdmin && (
                      <Trash2 size={12} style={{ color: "var(--color-text-danger)", cursor: "pointer" }} onClick={() => deleteMutation.mutate({ id: s.id })} />
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.description}</div>
                <div className="src" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{s.accessMethod || s.sourceUrl}</span>
                  {s.sourceUrl && (
                    <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-info)", fontSize: 9 }}>
                      <ExternalLink size={8} style={{ display: "inline" }} /> Visit
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {!src.length && [
            {
              name: "JKM / KPWKM — Social Welfare Department",
              category: "Ministry of Women, Family and Community Development",
              status: "live" as const,
              description: "Child abuse & neglect cases (2020–2024) · Child marriage statistics · TASKA enforcement records · Child protection team deployment · Parliamentary replies via Galen Centre, FMT, NST verification",
              source: "access: Parliamentary records · Ministry press releases · data.gov.my registry",
            },
            {
              name: "DOSM — Department of Statistics Malaysia",
              category: "OpenDOSM · data.gov.my open API (CC BY 4.0)",
              status: "live_api" as const,
              description: "HIES 2022: poverty by state/district/constituency · Population by state/age/ethnicity · Births & vital statistics · Gini coefficient · Household income by state · All under CC BY 4.0 open licence",
              source: "api: https://api.data.gov.my · https://open.dosm.gov.my · No auth required",
            },
            {
              name: "UNICEF Malaysia — advocacy & research",
              category: "UN Malaysia country office publications",
              status: "reference" as const,
              description: "Child marriage advocacy brief (2021) · Digital landscape report · UNICEF AI Strategy for ethical AI requirements · 2007–2017 cumulative 15,000 child marriages · Factsheet EN + BM",
              source: "source: malaysia.un.org · unicef.org/malaysia · PMC peer-reviewed",
            },
            {
              name: "BMJ Open — peer-reviewed research (PMC6731912)",
              category: "Nakayama et al. · Kyoto University · 2019",
              status: "academic" as const,
              description: "In-depth qualitative study of child marriage drivers in Kelantan: education poverty, community norms, religious framing, economic pressure, legal gaps.",
              source: "doi: 10.1136/bmjopen-2018-027377 · pmc.ncbi.nlm.nih.gov/articles/PMC6731912",
            },
          ].map((s, i) => {
            const cfg = statusConfig[s.status || "reference"] || statusConfig.reference;
            const Icon = cfg.icon;
            return (
              <div key={i} className="card-d">
                <div className="ch">
                  <div><div className="ct">{s.name}</div><div className="cs">{s.category}</div></div>
                  <span className={`pill ${cfg.className}`}><Icon size={8} style={{ display: "inline", marginRight: 2 }} />{(s.status || "reference").replace("_", " ")}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.description}</div>
                <div className="src">{s.source}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
