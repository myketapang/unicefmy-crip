export default function GlossaryPage() {
  const sections: { heading: string; items: { term: string; definition: string }[] }[] = [
    {
      heading: "Government agencies",
      items: [
        { term: "DOSM",       definition: "Department of Statistics Malaysia — national statistical authority. Publishes HIES (Household Income & Expenditure Survey), poverty rates, PLI, and population data under CC BY 4.0." },
        { term: "JKM",        definition: "Jabatan Kebajikan Masyarakat (Department of Social Welfare) — registers care facilities, deploys 140 Child Protection Teams nationwide, and reports annual child abuse statistics." },
        { term: "KPWKM",      definition: "Kementerian Pemberdayaan Wanita, Keluarga dan Masyarakat (Ministry of Women, Family & Community Development) — lead ministry for child rights policy, child marriage reform, and KASIH/TASKA oversight." },
        { term: "PDRM",       definition: "Polis Diraja Malaysia (Royal Malaysia Police) — reports sexual crime statistics by victim age and cybercrime data including online child exploitation." },
        { term: "MOH",        definition: "Ministry of Health Malaysia — tracks child health indicators (stunting, infant mortality), runs SIBS programme, and mandates abuse reporting by healthcare providers." },
        { term: "MOE",        definition: "Ministry of Education Malaysia — tracks school enrolment, dropout rates linked to child marriage, and digital access gaps among B40 families." },
        { term: "JAKIM",      definition: "Jabatan Kemajuan Islam Malaysia — advises on Islamic family law matters including Syariah court child marriage applications." },
        { term: "UNICEF MY",  definition: "United Nations Children's Fund Malaysia country office — technical partner for child rights monitoring, CRC reporting, and the CRIP platform." },
        { term: "UN Malaysia", definition: "United Nations country team in Malaysia — inter-agency coordination body for SDGs and CRC compliance." },
      ],
    },
    {
      heading: "Programmes & initiatives",
      items: [
        { term: "KASIH",       definition: "Kanak-kanak Aman, Selamat, Intelek & Harmoni — KPWKM school-based child protection prevention programme. Reached 174,079 students in 337 schools (2024). Budget 2023: RM 156 million." },
        { term: "TASKA",       definition: "Taman Asuhan Kanak-Kanak — licensed childcare centres regulated under the Child Care Centre Act 1984. Abuse incidents in TASKA are tracked separately by JKM." },
        { term: "NSP 2020-2025", definition: "National Strategic Plan on Ending Child Marriage 2020-2025 — government roadmap under KPWKM targeting reduction of child marriages, especially in Sabah, Kelantan, and Sarawak." },
        { term: "SIBS",        definition: "Sejahtera Ibu dan Bayi Selamat — MOH maternal and child health programme. Covers 78% of public health facilities (2024). Infant mortality rate: 6.8 per 1,000 live births." },
        { term: "CAREI",       definition: "Child Abuse Reporting and Early Intervention — school-based system piloted in 500 schools (2024) linking teachers, JKM, and PDRM for faster child protection response." },
        { term: "BSH / STR",   definition: "Bantuan Sara Hidup Rakyat / Sumbangan Tunai Rakyat — government cash transfer programmes. Cited in Parliament as insufficient to address structural child poverty without a universal child allowance." },
        { term: "CRIP",        definition: "Child Rights Intelligence Platform — this prototype. Aggregates multi-source data for UNICEF Malaysia Phase 1 deployment. Covers 9 modules: overview, child marriage, abuse, poverty, facilities, discourse NLP, Hansard, data sources, glossary." },
      ],
    },
    {
      heading: "Legislation & policy",
      items: [
        { term: "Child Act 2001",       definition: "Primary legislation for child welfare in Malaysia. Key sections: s.17 (fit person/protection order), s.31 (cruelty to children — maximum 20 years prison after 2021 amendment proposal)." },
        { term: "LRA 1976 / Amendment", definition: "Law Reform (Marriage and Divorce) Act 1976 — governs non-Muslim marriages. The 2023 amendment (passed with 2/3 Dewan Rakyat majority) set 18 as minimum marriage age for non-Muslims." },
        { term: "Syariah court",        definition: "Islamic family law courts with jurisdiction over Muslim marriages. Can approve child marriages under 18 with court consent. Not covered by the 2023 LRA amendment." },
        { term: "CRC",                  definition: "Convention on the Rights of the Child — UN treaty ratified by Malaysia in 1995. Malaysia submits periodic reports to the UN Committee on the Rights of the Child. 3rd periodic report submitted Dec 2023." },
        { term: "CRC Optional Protocol", definition: "Supplementary treaties to the CRC covering sale of children, child prostitution/pornography, and child soldiers. Malaysia has not ratified all optional protocols as of 2024." },
        { term: "Digital Platform Act", definition: "Proposed Malaysian legislation requiring platforms to implement age verification and child content filters. Discussed in Parliament Nov 2024 in response to 310% rise in online child exploitation." },
      ],
    },
    {
      heading: "Data & statistics terms",
      items: [
        { term: "HIES",              definition: "Household Income & Expenditure Survey — DOSM biennial survey providing national and state poverty rates, income distribution, and Gini coefficient data." },
        { term: "PLI",               definition: "Poverty Line Income — monthly household income threshold below which a household is classified poor. PLI 2022: RM 2,589/month (updated from RM 980 in 2019). Set by DOSM each HIES cycle." },
        { term: "Absolute poverty",  definition: "Share of households earning below PLI. National rate 2022: 6.2% (DOSM). Child poverty rate peaked at 11.8% during MCO 2020 (pandemic impact)." },
        { term: "Stunting",          definition: "Height-for-age below -2 SD — indicator of chronic malnutrition. 21.3% of Malaysian children under 5 affected (NHMS 2023), directly linked to household poverty." },
        { term: "Composite score",   definition: "Weighted index combining poverty rate, child marriage cases, abuse cases, and facility gap to rank state-level intervention priority (P1/P2/P3)." },
        { term: "Hansard",           definition: "Official verbatim transcript of parliamentary debates, questions, and statements. Malaysia's Dewan Rakyat Hansard records are published at parlimen.gov.my and hansard.parlimen.gov.my." },
        { term: "BMJ Open PMC6731912", definition: "Peer-reviewed qualitative study of child marriage drivers in Kelantan (Nakayama et al., 2019, Kyoto University). Used to contextualise East Coast P1 classification." },
        { term: "Sentiment score",   definition: "Numeric value from -1 (most negative) to +1 (most positive) assigned to news/social media text by the NLP pipeline using keyword matching on BM + EN text." },
        { term: "Corpus",            definition: "Body of text collected for NLP analysis. Platform corpus: news articles from Bing, Google Alerts RSS, and social media posts; BM + EN; rolling feed." },
      ],
    },
    {
      heading: "Geographic priority tiers",
      items: [
        { term: "P1 — Critical",    definition: "Highest-risk zones requiring immediate deployment. Sabah (poverty 19.8%, 1,174 child marriages in 2020), Kelantan (12.3% poverty, 521 marriages), Sarawak rural (highest dropout). Composite: poverty + marriage + abuse + facility gap." },
        { term: "P2 — Elevated",    definition: "Moderate risk states with active monitoring. Terengganu (11.2%), Kedah (10.8%) — East Coast and North clusters with elevated poverty and marriage rates." },
        { term: "P3 — Baseline",    definition: "States with adequate facility base but high absolute abuse volume due to population size. E.g., Selangor (poverty 1.5%, 68 facilities, but high urban abuse caseload)." },
        { term: "East Coast cluster", definition: "Kelantan, Terengganu, Pahang — historically elevated child marriage and poverty rates. Focal zone for NSP 2020-2025 interventions. Sabah classified separately as P1 due to highest absolute marriage cases." },
        { term: "B40",              definition: "Bottom 40% income group — DOSM classification. 9.4% of B40 children lack home internet access (2023), creating digital learning gaps especially in Sabah and Sarawak." },
      ],
    },
    {
      heading: "Live data & technical platform",
      items: [
        { term: "Google Trends",    definition: "Search interest data from Google (0-100 normalised scale). Platform tracks 'child marriage', 'child abuse', 'child rights' in Malaysia (geo: MY). Prefetched at build time; 1-hour cache in dev." },
        { term: "Google Alerts RSS", definition: "Atom feed of news articles matching saved search terms. Platform monitors 5 alerts: 'perkahwinan kanak-kanak', 'child marriage Malaysia', 'penganiayaan kanak-kanak', 'TASKA Malaysia', 'hak kanak-kanak'. Parsed inline, 30-minute cache." },
        { term: "Bing News API",    definition: "Microsoft Azure news search API. Platform runs 6 queries targeting BM + EN child rights terms. Returns articles with title, description, URL, and publish date. Free tier: 1,000 transactions/month." },
        { term: "NLP pipeline",     definition: "Natural Language Processing workflow that ingests RSS/news text, detects language (BM/EN), classifies sentiment (positive/negative/neutral) using keyword matching arrays, extracts topic tags, and assigns risk flags." },
        { term: "Discourse NLP",    definition: "Platform module (Sentiment page) showing 30-day Google Trends chart, 14-day news volume bar chart, keyword cloud, and classified article feed from Bing + Google Alerts." },
        { term: "tRPC",             definition: "Type-safe remote procedure call layer used by the CRIP platform frontend to fetch data from the Hono backend API. Falls back to static JSON on Netlify static deployment." },
        { term: "Netlify Function", definition: "Serverless Lambda handler deployed at /.netlify/functions/news. Calls Bing API and Google Alerts RSS at runtime in production. Reads BING_NEWS_API_KEY and GOOGLE_ALERTS_RSS_URLS from Netlify env vars." },
        { term: "Phase 1",          definition: "Current prototype scope — read-only dashboard with 9 modules for UNICEF Malaysia internal use. Phase 2 would include live data ingestion, alert workflows, and state-level user access control." },
      ],
    },
    {
      heading: "Child rights vocabulary",
      items: [
        { term: "Child marriage",           definition: "Formal or informal union where at least one party is under 18. Banned for non-Muslims under LRA 2023 amendment. Still permitted via Syariah court for Muslims. Data: KPWKM parliamentary replies 2019-2024." },
        { term: "Child abuse & neglect",    definition: "Physical, emotional, sexual abuse or neglect of a person under 18. JKM tracks reported cases (7,109 in 2022, record high). PDRM tracks sexual crimes separately (22% increase 2023)." },
        { term: "Online child exploitation", definition: "Sexual exploitation of children via digital platforms. PDRM Cyber Crime: 310% increase 2020-2023. Prompted Parliament debate on Digital Platform Act mandating age verification." },
        { term: "Child protection team",    definition: "JKM-deployed multidisciplinary field teams handling child protection cases at district level. 140 teams nationwide (2023). Case ratio 1:47 per social worker vs. international standard of 1:20." },
        { term: "Bumiputera",              definition: "Malay and indigenous ethnic classification used in DOSM and KPWKM datasets. Used to disaggregate child marriage and poverty statistics by ethnicity." },
        { term: "Mandatory reporting",     definition: "Legal obligation for healthcare providers, teachers, and social workers to report suspected child abuse. MOH 24-hour JKM reporting protocol (2022). Expanded under proposed Child Protection Act 2024." },
        { term: "CRC compliance",          definition: "Degree to which Malaysia's laws and programmes align with UN Convention on the Rights of the Child obligations. Platform tracks legislative milestones (LRA 2023, Child Act amendments) and resource gaps (JKM staffing, TASKA coverage)." },
      ],
    },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <div className="tt">Abbreviations & terminology</div>
          <div className="tm">Agencies · legislation · programmes · data terms · platform concepts · child rights definitions</div>
        </div>
      </div>
      <div className="content">
        {sections.map(sec => (
          <div key={sec.heading} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{sec.heading}</div>
            <div className="card-d" style={{ padding: 0 }}>
              {sec.items.map((item, i) => (
                <div key={item.term}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "8px 16px",
                    padding: "9px 14px",
                    borderBottom: i < sec.items.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                    alignItems: "baseline",
                  }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.4 }}>{item.term}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>{item.definition}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="src" style={{ marginTop: 4 }}>
          Sources: DOSM · JKM · KPWKM · MOH · MOE · PDRM · UNICEF MY · Dewan Rakyat Hansard · BMJ Open · platform documentation
        </div>
      </div>
    </>
  );
}
