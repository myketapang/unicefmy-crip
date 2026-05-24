export default function GlossaryPage() {
  const sections: { heading: string; items: { term: string; definition: string }[] }[] = [
    {
      heading: "Agencies & organisations",
      items: [
        { term: "DOSM", definition: "Department of Statistics Malaysia — national statistical authority, publishes HIES (Household Income & Expenditure Survey) and poverty rate data." },
        { term: "JKM", definition: "Jabatan Kebajikan Masyarakat (Department of Social Welfare) — registers care facilities, deploys Child Protection Teams, and reports child abuse statistics." },
        { term: "KPWKM", definition: "Kementerian Pemberdayaan Wanita, Keluarga dan Masyarakat (Ministry of Women, Family & Community Development) — lead ministry for child rights policy, oversees KASIH programme." },
        { term: "PDRM", definition: "Polis Diraja Malaysia (Royal Malaysia Police) — reports sexual crime statistics disaggregated by victim age." },
        { term: "UNICEF MY", definition: "United Nations Children's Fund Malaysia country office — technical partner for child rights monitoring and the CRIP platform." },
        { term: "UN Malaysia", definition: "United Nations country team in Malaysia — inter-agency coordination body." },
      ],
    },
    {
      heading: "Programmes & initiatives",
      items: [
        { term: "KASIH", definition: "Kanak-kanak Aman, Selamat, Intelek & Harmoni — KPWKM school-based child protection prevention programme. Reached 174,079 students in 337 schools (2024)." },
        { term: "TASKA", definition: "Taman Asuhan Kanak-Kanak — licensed childcare centres regulated under the Child Care Centre Act 1984. Abuse incidents in TASKA are tracked separately by JKM." },
        { term: "NSP 2020–2025", definition: "National Strategic Plan on Ending Child Marriage 2020–2025 — government roadmap under KPWKM targeting reduction of child marriages nationwide." },
        { term: "CRIP", definition: "Child Rights Intelligence Platform — this prototype. Aggregates multi-source data for UNICEF Malaysia Phase 1 deployment across high-priority states." },
      ],
    },
    {
      heading: "Data & statistics terms",
      items: [
        { term: "HIES", definition: "Household Income & Expenditure Survey — DOSM survey (biennial) providing national and state-level poverty rates and income distribution data." },
        { term: "Absolute poverty rate", definition: "Share of households earning below the Poverty Line Income (PLI). National PLI 2022: RM 2,589/month. Used to classify P1/P2/P3 priority zones." },
        { term: "BMJ Open", definition: "Peer-reviewed open-access journal (British Medical Journal group). The platform references a BMJ Open study on child marriage risk factors in Malaysia for Kelantan and East Coast states." },
        { term: "Sentiment score", definition: "Numeric value from −1 (most negative) to +1 (most positive) assigned to social media discourse by the NLP pipeline. Computed from tokenised BM + EN text." },
        { term: "Corpus", definition: "Body of text collected for NLP analysis. Platform corpus: Twitter/X and Facebook posts, BM + EN, rolling 7-day window (~48K posts/week estimated)." },
      ],
    },
    {
      heading: "Geographic priority tiers",
      items: [
        { term: "P1 — Critical", definition: "Highest-risk zones requiring immediate platform deployment. Sabah (poverty 19.8%), Kelantan (12.3%), Sarawak rural (highest marriage-linked school dropout). Composite score: poverty rate + child marriage count + abuse cases + facility gap." },
        { term: "P2 — Elevated", definition: "Moderate risk states with active monitoring. Terengganu (11.2%) and Kedah (10.8%) — East Coast and North clusters." },
        { term: "P3 — Baseline", definition: "States with adequate facility base but high absolute abuse volume due to population size. E.g., Selangor (poverty 1.5%, 68 facilities)." },
        { term: "East Coast cluster", definition: "Kelantan, Terengganu, Pahang — historically elevated child marriage and poverty rates; focal zone for NSP 2020–2025 interventions." },
      ],
    },
    {
      heading: "Technical platform terms",
      items: [
        { term: "NLP pipeline", definition: "Natural Language Processing workflow that ingests raw social media text, detects language (BM/EN), tokenises, classifies sentiment (positive/negative/neutral), extracts keywords, and assigns risk flags." },
        { term: "Discourse NLP monitor", definition: "Platform module (Sentiment page) showing 30-day sentiment trend, keyword cloud, and classified post feed derived from the NLP pipeline." },
        { term: "Composite risk model", definition: "Weighted scoring model combining poverty rate (DOSM), child marriage count (KPWKM), abuse cases (JKM), and facility count (JKM) to rank state-level intervention priority." },
        { term: "tRPC", definition: "Type-safe remote procedure call layer used by the CRIP platform frontend to fetch data from the backend API without REST boilerplate." },
        { term: "Phase 1", definition: "Current prototype scope — read-only dashboard across 7 modules for UNICEF Malaysia internal use. Phase 2 would include live data ingestion and alert workflows." },
      ],
    },
    {
      heading: "Child rights terminology",
      items: [
        { term: "Child marriage", definition: "Formal or informal union where at least one party is under 18. In Malaysia, permitted with court or religious authority approval. Data source: KPWKM parliamentary replies, 2019–2023." },
        { term: "Child abuse & neglect", definition: "Physical, emotional, sexual abuse or neglect of a person under 18. JKM tracks reported cases; PDRM tracks sexual crimes against children separately." },
        { term: "Bumiputera", definition: "Malay and indigenous ethnic classification used in DOSM and KPWKM datasets for disaggregating child marriage and poverty statistics." },
        { term: "PLI", definition: "Poverty Line Income — monthly household income threshold below which a household is classified as poor. Set by DOSM; reviewed each HIES cycle." },
        { term: "Child protection team", definition: "JKM-deployed multidisciplinary field teams handling child protection cases at district level. 140 teams active nationwide as of 2023." },
      ],
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Abbreviations & terminology</div>
          <div className="tm">Agencies · programmes · data terms · platform concepts · child rights definitions</div>
        </div>
      </div>
      <div className="content">
        {sections.map(sec => (
          <div key={sec.heading} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{sec.heading}</div>
            <div className="card-d" style={{ padding: 0 }}>
              {sec.items.map((item, i) => (
                <div
                  key={item.term}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    gap: "8px 16px",
                    padding: "9px 14px",
                    borderBottom: i < sec.items.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.4 }}>{item.term}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>{item.definition}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="src" style={{ marginTop: 4 }}>Sources: DOSM · JKM · KPWKM · UNICEF MY · BMJ Open · platform documentation</div>
      </div>
    </>
  );
}
