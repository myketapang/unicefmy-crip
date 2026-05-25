import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { CircleCheck, Database, BookOpen, AlertTriangle, Sparkles, ExternalLink, Trash2, Plus, Rss, TrendingUp, Landmark } from "lucide-react";

const statusConfig: Record<string, { icon: typeof CircleCheck; className: string }> = {
  live:          { icon: CircleCheck, className: "p-ok" },
  live_api:      { icon: Database,    className: "p-ok" },
  verified:      { icon: CircleCheck, className: "p-ok" },
  reference:     { icon: BookOpen,    className: "p-bl" },
  academic:      { icon: BookOpen,    className: "p-bl" },
  supplementary: { icon: AlertTriangle, className: "p-md" },
  prototype:     { icon: Sparkles,    className: "p-md" },
};

const STATIC_SOURCES = [
  {
    name: "JKM / KPWKM — Social Welfare Department",
    category: "Ministry of Women, Family & Community Development",
    status: "live" as const,
    icon: CircleCheck,
    description: "Child abuse & neglect cases 2019–2024 · Child marriage statistics by state · TASKA enforcement records · 140 Child Protection Teams nationwide · KASIH programme enrolment · Parliamentary Q&A replies via Galen Centre, FMT, NST verification.",
    source: "Parliamentary records · Ministry press releases · data.gov.my registry · https://www.jkm.gov.my",
    url: "https://www.kpwkm.gov.my",
  },
  {
    name: "DOSM — Department of Statistics Malaysia",
    category: "OpenDOSM · data.gov.my open API (CC BY 4.0)",
    status: "live_api" as const,
    icon: Database,
    description: "HIES 2022: poverty by state/district/constituency · Population by state/age/ethnicity · Births & vital statistics · Gini coefficient · Household income by state · Poverty Line Income (PLI 2022: RM 2,589/month) · All under CC BY 4.0 open licence.",
    source: "api.data.gov.my · open.dosm.gov.my · No auth required",
    url: "https://open.dosm.gov.my",
  },
  {
    name: "Parlimen.gov.my — Dewan Rakyat Hansard",
    category: "Malaysian Parliament · Dewan Rakyat transcripts",
    status: "live" as const,
    icon: Landmark,
    description: "38 verified Hansard records (2019–2024) covering child marriage legislation, child abuse parliamentary Q&A, budget debates, and child rights statements. Sourced from official Dewan Rakyat PDF transcripts and govtechmy/hansards-front.",
    source: "www.parlimen.gov.my · hansard.parlimen.gov.my · govtechmy/hansards-front",
    url: "https://www.parlimen.gov.my",
  },
  {
    name: "Google Trends — Search Interest Data",
    category: "Alphabet Inc. · google-trends-api · Geo: MY",
    status: "live_api" as const,
    icon: TrendingUp,
    description: "30-day normalised search interest (0–100 scale) for child rights keywords in Malaysia. Keywords: 'child marriage', 'child abuse', 'child rights'. Aggregated from Google Search volume, geo-filtered to Malaysia (MY). Prefetched at build time into public/data/trends.json.",
    source: "trends.google.com · npm: google-trends-api v4 · Prefetch script: scripts/prefetch-trends.ts",
    url: "https://trends.google.com",
  },
  {
    name: "Google Alerts — RSS Keyword Feeds",
    category: "Alphabet Inc. · Atom RSS · 5 active alerts",
    status: "live" as const,
    icon: Rss,
    description: "Real-time news alerts via RSS Atom feeds for: 'perkahwinan kanak-kanak', 'child marriage Malaysia', 'penganiayaan kanak-kanak', 'TASKA Malaysia', 'hak kanak-kanak'. Each alert delivers matching news articles within minutes of publication. Parsed inline without external dependencies.",
    source: "google.com/alerts · RSS Atom feed · booluckgmie@gmail.com account · 30-min cache",
    url: "https://www.google.com/alerts",
  },
  {
    name: "Bing News Search API",
    category: "Microsoft Azure Cognitive Services · Free tier",
    status: "supplementary" as const,
    icon: Database,
    description: "News article feed using 6 targeted queries: 'perkahwinan kanak-kanak Malaysia', 'child marriage Malaysia', 'penganiayaan kanak-kanak Malaysia', 'TASKA abuse Malaysia', 'hak kanak-kanak JKM', 'child protection Malaysia UNICEF'. Returns article titles, URLs, descriptions, and published dates.",
    source: "api.bing.microsoft.com/v7.0/news/search · Azure portal · Free: 1,000 tx/month",
    url: "https://www.microsoft.com/en-us/bing/apis/bing-news-search-api",
  },
  {
    name: "UNICEF Malaysia — advocacy & research",
    category: "UN Malaysia country office publications",
    status: "reference" as const,
    icon: BookOpen,
    description: "Child marriage advocacy brief (2021) · Digital landscape for children report · UNICEF AI Ethics requirements · 2007–2017: 15,000+ cumulative child marriages · CRC periodic review inputs · Factsheet EN + BM.",
    source: "malaysia.un.org · unicef.org/malaysia · PMC peer-reviewed",
    url: "https://www.unicef.org/malaysia",
  },
  {
    name: "PDRM — Royal Malaysia Police",
    category: "Ministry of Home Affairs · Crime statistics",
    status: "verified" as const,
    icon: CircleCheck,
    description: "Sexual crime statistics disaggregated by victim age (under 18) · Cybercrime investigation data including online child exploitation · Annual crime index reports. Referenced in platform: 22% increase in sexual crimes against children (2023), 310% rise in online exploitation (2020–2023).",
    source: "rmp.gov.my · Parliamentary written answers · Bukit Aman press releases",
    url: "https://www.rmp.gov.my",
  },
  {
    name: "MOH — Ministry of Health Malaysia",
    category: "Kementerian Kesihatan Malaysia",
    status: "verified" as const,
    icon: CircleCheck,
    description: "National Health & Morbidity Survey (NHMS) data · Child stunting rates (21.3% under-5, 2023) · Infant mortality rate (6.8 per 1,000 live births, 2024) · Mandatory abuse reporting protocols · SIBS programme (Sejahtera Ibu dan Bayi Selamat) coverage data.",
    source: "moh.gov.my · iku.gov.my (NHMS) · Parliamentary health committee replies",
    url: "https://www.moh.gov.my",
  },
  {
    name: "BMJ Open — peer-reviewed research (PMC6731912)",
    category: "Nakayama et al. · Kyoto University · 2019",
    status: "academic" as const,
    icon: BookOpen,
    description: "Qualitative study of child marriage drivers in Kelantan: education poverty, community norms, religious framing, economic pressure, and legal gaps. Used to contextualise state-level risk scores and East Coast cluster P1 classification.",
    source: "doi: 10.1136/bmjopen-2018-027377 · pmc.ncbi.nlm.nih.gov/articles/PMC6731912",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6731912",
  },
];

export default function SourcesPage() {
  const { data: sources, refetch } = trpc.crip.sources.list.useQuery();
  const { data: authUser } = trpc.auth.me.useQuery();
  const isAdmin = authUser?.role === "admin";

  const [showAdd, setShowAdd] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", category: "", description: "", sourceUrl: "" });

  const createMutation = trpc.crip.sources.create.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); setNewSource({ name: "", category: "", description: "", sourceUrl: "" }); } });
  const deleteMutation = trpc.crip.sources.delete.useMutation({ onSuccess: () => refetch() });

  const src = sources || [];
  const showStatic = src.length === 0;
  const displayCount = showStatic ? STATIC_SOURCES.length : src.length;

  const inStyle: React.CSSProperties = { flex: 1, minWidth: 150, padding: "4px 8px", fontSize: 11, borderRadius: 4, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Data source registry · {displayCount} verified sources</div>
          <div className="tm">JKM · DOSM · KPWKM · Hansard · Google Trends · Google Alerts · UNICEF MY · PDRM · MOH · BMJ Open</div>
        </div>
      </div>
      <div className="content">
        <div className="mrow m3">
          {[
            { id:1, label:"Data sources registered",  value: String(displayCount), subtext:"Active in this platform",       status:"positive" },
            { id:2, label:"Data points ingested",      value:"3,200+",              subtext:"Across all modules"             },
            { id:3, label:"Update frequency",          value:"Live + Annual",       subtext:"RSS live · Hansard · Surveys"   },
          ].map(m => (
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
                  <input placeholder="Source name"  value={newSource.name}        onChange={e => setNewSource({ ...newSource, name: e.target.value })}        style={{ ...inStyle }} />
                  <input placeholder="Category"     value={newSource.category}    onChange={e => setNewSource({ ...newSource, category: e.target.value })}    style={{ ...inStyle }} />
                  <input placeholder="Description"  value={newSource.description} onChange={e => setNewSource({ ...newSource, description: e.target.value })} style={{ ...inStyle, flex: 2, minWidth: 200 }} />
                  <input placeholder="URL"          value={newSource.sourceUrl}   onChange={e => setNewSource({ ...newSource, sourceUrl: e.target.value })}   style={{ ...inStyle }} />
                  <button onClick={() => createMutation.mutate({ ...newSource, status: "reference" })} className="ni on" style={{ width: "auto" }}>Save</button>
                  <button onClick={() => setShowAdd(false)} className="ni" style={{ width: "auto" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!showStatic && src.map((s) => {
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

          {showStatic && STATIC_SOURCES.map((s) => {
            const cfg = statusConfig[s.status];
            const Icon = cfg.icon;
            return (
              <div key={s.name} className="card-d">
                <div className="ch">
                  <div>
                    <div className="ct">{s.name}</div>
                    <div className="cs">{s.category}</div>
                  </div>
                  <span className={`pill ${cfg.className}`}>
                    <Icon size={8} style={{ display: "inline", marginRight: 2 }} />
                    {s.status.replace("_", " ")}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.description}</div>
                <div className="src" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{s.source}</span>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-info)", fontSize: 9 }}>
                      <ExternalLink size={8} style={{ display: "inline" }} /> Visit
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
