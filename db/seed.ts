import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

const db = getDb();

async function seed() {
  console.log("Seeding UNICEF Malaysia CRIP data...");

  // ── Key Metrics ─────────────────────────────────────────────────
  await db.insert(schema.keyMetrics).values([
    { category: "overview", label: "Child marriages (2023)", value: "923", subtext: "↓ 37% from 2019 · DOSM/KPWKM", status: "moderate", source: "KPWKM parliamentary reply Feb 2025", year: 2023, module: "overview", order: 1 },
    { category: "overview", label: "Child abuse cases (2023)", value: "4,469", subtext: "JKM verified · +vs 2022", status: "critical", source: "JKM annual data", year: 2023, module: "overview", order: 2 },
    { category: "overview", label: "National poverty rate", value: "6.2%", subtext: "DOSM HIS 2022 · ↓ from 8.2%", status: "moderate", source: "DOSM HIES 2022", year: 2022, module: "overview", order: 3 },
    { category: "overview", label: "Highest state poverty", value: "19.8%", subtext: "Sabah · DOSM 2022", status: "critical", source: "DOSM HIES 2022", year: 2022, module: "overview", order: 4 },
    { category: "marriage", label: "2019 (baseline)", value: "1,467", subtext: "DOSM/KPWKM", status: "neutral", source: "KPWKM parliamentary data", year: 2019, module: "marriage", order: 1 },
    { category: "marriage", label: "2023 (latest)", value: "923", subtext: "↓ 37% from baseline", status: "positive", source: "KPWKM parliamentary reply Feb 2025", year: 2023, module: "marriage", order: 2 },
    { category: "marriage", label: "2007–2017 total", value: "15,000", subtext: "UNICEF advocacy brief", status: "critical", source: "UNICEF Malaysia advocacy brief 2021", year: 2017, module: "marriage", order: 3 },
    { category: "marriage", label: "Bumiputera share (2020)", value: "91%", subtext: "1,233 of 1,354 · KPWKM", status: "neutral", source: "KPWKM parliamentary data", year: 2020, module: "marriage", order: 4 },
    { category: "abuse", label: "2020–2022 total (JKM)", value: "18,750", subtext: "Physical + sexual + emotional + neglect", status: "critical", source: "JKM ministry data", year: 2022, module: "abuse", order: 1 },
    { category: "abuse", label: "2023 full year (JKM)", value: "4,469", subtext: "KPWKM Dec 2024 report", status: "critical", source: "KPWKM Dec 2024 report", year: 2023, module: "abuse", order: 2 },
    { category: "abuse", label: "Sexual crimes vs children (PDRM 2023)", value: "5,401", subtext: "Royal Malaysian Police", status: "critical", source: "PDRM 2023 data", year: 2023, module: "abuse", order: 3 },
    { category: "abuse", label: "Girls: sexual abuse share", value: "92.3%", subtext: "2023 · KPWKM breakdown", status: "critical", source: "KPWKM parliamentary data", year: 2023, module: "abuse", order: 4 },
    { category: "poverty", label: "National poverty 2022", value: "6.2%", subtext: "↓ from 8.2% in 2021 · DOSM HIES", status: "moderate", source: "DOSM HIES 2022", year: 2022, module: "poverty", order: 1 },
    { category: "poverty", label: "COVID impact peak (2020)", value: "8.4%", subtext: "580K M40 → B40 · DOSM", status: "critical", source: "DOSM HIES 2022", year: 2020, module: "poverty", order: 2 },
    { category: "poverty", label: "Poverty Line Income 2022", value: "RM 2,589", subtext: "↑ from RM 2,208 (2019) · DOSM", status: "neutral", source: "DOSM HIES 2022", year: 2022, module: "poverty", order: 3 },
    { category: "facilities", label: "JKM registered facilities", value: "312", subtext: "Institusi Kanak-Kanak", status: "neutral", source: "JKM registry", year: 2024, module: "facilities", order: 1 },
    { category: "facilities", label: "Child protection teams", value: "140", subtext: "Active nationwide · JKM 2023", status: "positive", source: "JKM 2023", year: 2023, module: "facilities", order: 2 },
    { category: "facilities", label: "Child welfare teams", value: "133", subtext: "JKM ministry statement", status: "positive", source: "JKM ministry", year: 2023, module: "facilities", order: 3 },
    { category: "facilities", label: "KASIH prog. reach (2024)", value: "174K", subtext: "Students · 337 schools", status: "positive", source: "KPWKM official", year: 2024, module: "facilities", order: 4 },
    { category: "sentiment", label: "Corpus monitored (est. 7d)", value: "48.2K", subtext: "Twitter/X + Facebook BM+EN", status: "neutral", source: "NarrativeGPT NLP", year: 2026, module: "sentiment", order: 1 },
    { category: "sentiment", label: "Bahasa Melayu share", value: "71%", subtext: "NarrativeGPT multilingual", status: "neutral", source: "NarrativeGPT NLP", year: 2026, module: "sentiment", order: 2 },
    { category: "sentiment", label: "Child marriage mentions", value: "+340%", subtext: "7-day spike · Kelantan cluster", status: "critical", source: "NarrativeGPT NLP", year: 2026, module: "sentiment", order: 3 },
    { category: "sentiment", label: "Overall sentiment", value: "+0.42", subtext: "−1 to +1 scale", status: "positive", source: "NarrativeGPT NLP", year: 2026, module: "sentiment", order: 4 },
    { category: "sources", label: "Verified data sources", value: "7", subtext: "Active in this platform", status: "positive", source: "Platform registry", year: 2026, module: "sources", order: 1 },
    { category: "sources", label: "Data points ingested", value: "2,400+", subtext: "Across all modules", status: "neutral", source: "Platform metrics", year: 2026, module: "sources", order: 2 },
    { category: "sources", label: "Update frequency", value: "Annual+", subtext: "Parliamentary · Periodic surveys", status: "neutral", source: "Platform registry", year: 2026, module: "sources", order: 3 },
  ]);

  // ── State Risk Rankings ─────────────────────────────────────────
  await db.insert(schema.stateRiskRankings).values([
    { state: "Sabah", povertyRate: "19.80", childMarriageCases: 86, abuseCases: 333, compositeScore: "0.92", riskLevel: "critical", priority: "P1", dropoutMarriages: 86, year: 2023, notes: "Highest risk composite nationally: 19.8% poverty, 86 child marriages, 333 abuse cases Jan–May 2023" },
    { state: "Kelantan", povertyRate: "12.30", childMarriageCases: 43, abuseCases: 143, compositeScore: "0.81", riskLevel: "critical", priority: "P1", dropoutMarriages: 43, year: 2023, notes: "BMJ Open 2019 identifies community norms, early school dropout, religious framing as primary drivers" },
    { state: "Terengganu", povertyRate: "11.20", childMarriageCases: null, abuseCases: null, compositeScore: "0.64", riskLevel: "high", priority: "P2", dropoutMarriages: null, year: 2023, notes: "East Coast cluster" },
    { state: "Kedah", povertyRate: "10.80", childMarriageCases: null, abuseCases: null, compositeScore: "0.57", riskLevel: "high", priority: "P2", dropoutMarriages: null, year: 2023, notes: "North cluster" },
    { state: "Sarawak", povertyRate: "7.90", childMarriageCases: 183, abuseCases: null, compositeScore: "0.46", riskLevel: "high", priority: "P1", dropoutMarriages: 183, year: 2023, notes: "Highest marriage dropouts nationally" },
    { state: "Pahang", povertyRate: "5.70", childMarriageCases: 38, abuseCases: null, compositeScore: "0.37", riskLevel: "moderate", priority: "P3", dropoutMarriages: 38, year: 2023, notes: "" },
    { state: "Selangor", povertyRate: "1.50", childMarriageCases: null, abuseCases: 647, compositeScore: "0.26", riskLevel: "monitor", priority: "P3", dropoutMarriages: null, year: 2023, notes: "High abuse volume but good facility base" },
    { state: "Perak", povertyRate: "7.40", childMarriageCases: null, abuseCases: 181, compositeScore: "0.40", riskLevel: "high", priority: "P2", dropoutMarriages: null, year: 2023, notes: "" },
    { state: "Kuala Lumpur", povertyRate: "0.40", childMarriageCases: null, abuseCases: 326, compositeScore: "0.20", riskLevel: "monitor", priority: "P3", dropoutMarriages: null, year: 2023, notes: "" },
  ]);

  // ── Child Marriage Data ─────────────────────────────────────────
  await db.insert(schema.childMarriageData).values([
    { year: 2019, totalCases: 1467, bumiputera: null, chinese: null, indian: null, others: null, source: "KPWKM parliamentary reply Feb 2025", verified: 1 },
    { year: 2020, totalCases: 1354, bumiputera: 1233, chinese: 63, indian: 12, others: 46, source: "KPWKM parliamentary reply May 2023 · Galen Centre", verified: 1 },
    { year: 2021, totalCases: 1086, bumiputera: null, chinese: null, indian: null, others: null, source: "KPWKM parliamentary data", verified: 1 },
    { year: 2022, totalCases: 1035, bumiputera: null, chinese: null, indian: null, others: null, source: "KPWKM parliamentary data", verified: 1 },
    { year: 2023, totalCases: 923, bumiputera: null, chinese: null, indian: null, others: null, source: "KPWKM parliamentary reply Feb 2025", verified: 1 },
  ]);

  // ── Abuse Cases ─────────────────────────────────────────────────
  await db.insert(schema.abuseCases).values([
    { year: 2020, totalCases: 5900, physicalGirls: "45.0", physicalBoys: "55.0", sexualGirls: "92.3", sexualBoys: "7.7", emotionalGirls: "65.0", emotionalBoys: "35.0", sexualCrimesPDRM: null, source: "KPWKM parliamentary replies · Galen Centre" },
    { year: 2021, totalCases: 6200, physicalGirls: "46.0", physicalBoys: "54.0", sexualGirls: "91.5", sexualBoys: "8.5", emotionalGirls: "64.0", emotionalBoys: "36.0", sexualCrimesPDRM: null, source: "KPWKM parliamentary replies · Galen Centre" },
    { year: 2022, totalCases: 5650, physicalGirls: "44.0", physicalBoys: "56.0", sexualGirls: "92.0", sexualBoys: "8.0", emotionalGirls: "66.0", emotionalBoys: "34.0", sexualCrimesPDRM: null, source: "KPWKM parliamentary replies · Galen Centre" },
    { year: 2023, totalCases: 4469, physicalGirls: "45.0", physicalBoys: "55.0", sexualGirls: "92.3", sexualBoys: "7.7", emotionalGirls: "65.0", emotionalBoys: "35.0", sexualCrimesPDRM: 5401, source: "KPWKM Dec 2024 report · PDRM" },
    { year: 2024, totalCases: 2240, physicalGirls: null, physicalBoys: null, sexualGirls: null, sexualBoys: null, emotionalGirls: null, emotionalBoys: null, sexualCrimesPDRM: 2059, source: "KPWKM Feb 2025 · Jan–Aug partial" },
  ]);

  // ── Abuse by State ──────────────────────────────────────────────
  await db.insert(schema.abuseByState).values([
    { state: "Selangor", cases: 647, period: "Jan–May", riskLevel: "highest", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
    { state: "Sabah", cases: 333, period: "Jan–May", riskLevel: "critical", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
    { state: "Kuala Lumpur", cases: 326, period: "Jan–May", riskLevel: "critical", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
    { state: "Johor", cases: 220, period: "Jan–May", riskLevel: "high", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
    { state: "Perak", cases: 181, period: "Jan–May", riskLevel: "high", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
    { state: "Kelantan", cases: 143, period: "Jan–May", riskLevel: "moderate", year: 2023, source: "JKM ministry statement Sep 2023 · FMT" },
  ]);

  // ── TASKA Abuse Cases ───────────────────────────────────────────
  await db.insert(schema.taskaAbuseCases).values([
    { year: 2020, abuseCases: 2, deaths: 1, source: "KPWKM Feb 2025 · Galen Centre report" },
    { year: 2021, abuseCases: 7, deaths: 1, source: "KPWKM Feb 2025 · Galen Centre report" },
    { year: 2022, abuseCases: 5, deaths: 1, source: "KPWKM Feb 2025 · Galen Centre report" },
    { year: 2023, abuseCases: 14, deaths: 1, source: "KPWKM Feb 2025 · Galen Centre report" },
    { year: 2024, abuseCases: 6, deaths: 4, source: "KPWKM Feb 2025 · Galen Centre report" },
  ]);

  // ── Poverty Data ────────────────────────────────────────────────
  await db.insert(schema.povertyData).values([
    { state: "Sabah", povertyRate: "19.80", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Kelantan", povertyRate: "12.30", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Terengganu", povertyRate: "11.20", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Kedah", povertyRate: "10.80", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Perak", povertyRate: "7.40", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Sarawak", povertyRate: "7.90", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Pahang", povertyRate: "5.70", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Selangor", povertyRate: "1.50", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Kuala Lumpur", povertyRate: "0.40", year: 2022, isNational: 0, source: "DOSM HIES 2022 · OpenDOSM" },
    { state: "Malaysia", povertyRate: "6.20", year: 2022, isNational: 1, source: "DOSM HIES 2022 · OpenDOSM" },
  ]);

  // ── Poverty Trend ───────────────────────────────────────────────
  await db.insert(schema.povertyTrend).values([
    { year: 2016, nationalPovertyRate: "0.40", povertyLineIncome: 2208, source: "DOSM HIES historical" },
    { year: 2019, nationalPovertyRate: "5.60", povertyLineIncome: 2208, source: "DOSM HIES 2022" },
    { year: 2020, nationalPovertyRate: "8.40", povertyLineIncome: 2500, source: "DOSM · PM Ismail Sabri parliamentary statement 2021" },
    { year: 2021, nationalPovertyRate: "8.20", povertyLineIncome: 2500, source: "DOSM HIES 2022" },
    { year: 2022, nationalPovertyRate: "6.20", povertyLineIncome: 2589, source: "DOSM HIES 2022" },
  ]);

  // ── Care Facilities ─────────────────────────────────────────────
  await db.insert(schema.careFacilities).values([
    { state: "Sabah", facilityCount: 27, povertyRate: "19.80", priority: "P1", interventionNotes: "Poverty 19.8% · 86 child marriages · 333 abuse cases · Interior district gaps", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Kelantan", facilityCount: 18, povertyRate: "12.30", priority: "P1", interventionNotes: "Poverty 12.3% · BMJ risk factors · Marriage spike", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Sarawak", facilityCount: 24, povertyRate: "7.90", priority: "P1", interventionNotes: "Highest marriage dropouts (183) · Facility gap · Rural access issues", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Terengganu", facilityCount: 12, povertyRate: "11.20", priority: "P2", interventionNotes: "Poverty 11.2% · East Coast cluster", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Kedah", facilityCount: 15, povertyRate: "10.80", priority: "P2", interventionNotes: "Poverty 10.8% · North cluster", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Pahang", facilityCount: 14, povertyRate: "5.70", priority: "P3", interventionNotes: "Moderate risk", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Perak", facilityCount: 21, povertyRate: "7.40", priority: "P2", interventionNotes: "Poverty 7.4%", year: 2024, source: "JKM registry · DOSM HIES 2022" },
    { state: "Selangor", facilityCount: 52, povertyRate: "1.50", priority: "P3", interventionNotes: "High abuse volume · Good facility base", year: 2024, source: "JKM registry · DOSM HIES 2022" },
  ]);

  // ── Discourse Feed ──────────────────────────────────────────────
  await db.insert(schema.discourseFeed).values([
    { content: "Perkahwinan kanak-kanak mesti dihentikan — undang-undang tidak mencukupi perlindungan", language: "ms", sentiment: "negative", riskLevel: "high", source: "Twitter/X", region: "Kelantan", tags: "child marriage,Kelantan", engagement: "1.2K RT · 2h ago", postedAt: new Date("2026-05-23T10:00:00Z"), verified: 1 },
    { content: "UNICEF Malaysia: New child protection programme launched under National Strategic Plan 2020–2025", language: "en", sentiment: "positive", riskLevel: "none", source: "Berita Harian", region: "National", tags: "UNICEF,policy", engagement: "National · 5h ago", postedAt: new Date("2026-05-23T07:00:00Z"), verified: 1 },
    { content: "Kes penganiayaan kanak-kanak di TASKA meningkat — perlu tindakan segera", language: "ms", sentiment: "negative", riskLevel: "high", source: "Facebook", region: "National", tags: "TASKA,JKM", engagement: "890 shares · 8h ago", postedAt: new Date("2026-05-23T04:00:00Z"), verified: 1 },
    { content: "Child marriages down 37% from 2019 to 2023 — Minister Nancy Shukri cites National Strategic Plan success", language: "en", sentiment: "neutral", riskLevel: "none", source: "FMT", region: "National", tags: "policy progress", engagement: "National · 12h ago", postedAt: new Date("2026-05-23T00:00:00Z"), verified: 1 },
    { content: "KASIH Kanak-Kanak programme reaches 174,079 students in 337 schools — community response positive", language: "en", sentiment: "positive", riskLevel: "none", source: "KPWKM official", region: "National", tags: "prevention", engagement: "Facebook · 24h ago", postedAt: new Date("2026-05-22T12:00:00Z"), verified: 1 },
    { content: "Rumah perlindungan kanak-kanak di Kelantan kekurangan tempat — kebajikan tidak terbela", language: "ms", sentiment: "negative", riskLevel: "medium", source: "Twitter/X", region: "Kelantan", tags: "shelter,Kelantan", engagement: "456 RT · 1d ago", postedAt: new Date("2026-05-22T08:00:00Z"), verified: 0 },
    { content: "Sabah interior children face education poverty — schools too far, dropout rates alarming", language: "en", sentiment: "negative", riskLevel: "high", source: "Facebook", region: "Sabah", tags: "education poverty,Sabah", engagement: "1.1K shares · 1d ago", postedAt: new Date("2026-05-22T06:00:00Z"), verified: 1 },
    { content: "JKM deploys 140 child protection teams nationwide — coverage improving", language: "en", sentiment: "positive", riskLevel: "none", source: "NST", region: "National", tags: "JKM,protection", engagement: "National · 2d ago", postedAt: new Date("2026-05-21T14:00:00Z"), verified: 1 },
  ]);

  // ── Sentiment Trend Data ────────────────────────────────────────
  const allScores = [0.38,0.41,0.35,0.28,0.22,0.19,0.25,0.30,0.38,0.42,0.45,0.48,0.51,0.46,0.40,0.38,0.42,0.44,0.40,0.35,0.30,0.25,0.20,0.18,0.28,0.38,0.42,0.45,0.43,0.42];
  const marriageScores = [-0.2,-0.18,-0.25,-0.35,-0.42,-0.5,-0.45,-0.38,-0.3,-0.25,-0.2,-0.28,-0.35,-0.4,-0.48,-0.55,-0.6,-0.58,-0.52,-0.48,-0.42,-0.38,-0.32,-0.4,-0.48,-0.52,-0.58,-0.62,-0.6,-0.58];
  const abuseScores = [-0.1,-0.08,-0.12,-0.18,-0.22,-0.28,-0.24,-0.2,-0.15,-0.1,-0.08,-0.12,-0.18,-0.22,-0.28,-0.32,-0.35,-0.38,-0.35,-0.3,-0.25,-0.2,-0.18,-0.22,-0.28,-0.32,-0.35,-0.38,-0.4,-0.42];

  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - 29 + i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    await db.insert(schema.sentimentTrendData).values([
      { topic: "all", dayIndex: i, sentimentScore: String(allScores[i]), date: dateStr },
      { topic: "marriage", dayIndex: i, sentimentScore: String(marriageScores[i]), date: dateStr },
      { topic: "abuse", dayIndex: i, sentimentScore: String(abuseScores[i]), date: dateStr },
    ]);
  }

  // ── Keywords ────────────────────────────────────────────────────
  await db.insert(schema.keywords).values([
    { keyword: "perlindungan kanak-kanak", color: "#378ADD", frequency: 1240, topic: "protection" },
    { keyword: "child marriage", color: "#E24B4A", frequency: 980, topic: "marriage" },
    { keyword: "perkahwinan kanak-kanak", color: "#E24B4A", frequency: 870, topic: "marriage" },
    { keyword: "JKM", color: "#378ADD", frequency: 750, topic: "institution" },
    { keyword: "UNICEF", color: "#639922", frequency: 720, topic: "institution" },
    { keyword: "kemiskinan", color: "#BA7517", frequency: 680, topic: "poverty" },
    { keyword: "hak kanak-kanak", color: "#639922", frequency: 650, topic: "rights" },
    { keyword: "rumah perlindungan", color: "#BA7517", frequency: 540, topic: "shelter" },
    { keyword: "TASKA", color: "#E24B4A", frequency: 510, topic: "abuse" },
    { keyword: "Nancy Shukri", color: "#378ADD", frequency: 480, topic: "policy" },
    { keyword: "Kelantan", color: "#E24B4A", frequency: 920, topic: "region" },
    { keyword: "Sabah", color: "#E24B4A", frequency: 890, topic: "region" },
    { keyword: "sekolah", color: "#639922", frequency: 760, topic: "education" },
    { keyword: "poverty", color: "#BA7517", frequency: 700, topic: "poverty" },
    { keyword: "child rights", color: "#639922", frequency: 620, topic: "rights" },
  ]);

  // ── Data Sources ────────────────────────────────────────────────
  await db.insert(schema.dataSources).values([
    {
      name: "JKM / KPWKM — Social Welfare Department",
      category: "Ministry of Women, Family and Community Development",
      status: "live",
      description: "Child abuse & neglect cases (2020–2024) · Child marriage statistics · TASKA enforcement records · Child protection team deployment · Parliamentary replies via Galen Centre, FMT, NST verification",
      sourceUrl: "https://www.kpwkm.gov.my",
      dataTypes: "Child abuse cases, marriage statistics, TASKA records, protection teams",
      updateFrequency: "Annual",
      accessMethod: "Parliamentary records · Ministry press releases · data.gov.my registry",
      relevance: "Core data source for abuse, marriage, and facility modules",
      notes: "Primary government source for child welfare data",
    },
    {
      name: "DOSM — Department of Statistics Malaysia",
      category: "OpenDOSM · data.gov.my open API (CC BY 4.0)",
      status: "live_api",
      description: "HIES 2022: poverty by state/district/constituency · Population by state/age/ethnicity · Births & vital statistics · Gini coefficient · Household income by state",
      sourceUrl: "https://api.data.gov.my · https://open.dosm.gov.my",
      dataTypes: "Poverty rates, household income, population demographics",
      updateFrequency: "Annual (HIES)",
      accessMethod: "Open API · No auth required · CC BY 4.0",
      relevance: "Core data source for poverty and risk mapping modules",
      notes: "All data under CC BY 4.0 open licence",
    },
    {
      name: "UNICEF Malaysia — advocacy & research",
      category: "UN Malaysia country office publications",
      status: "reference",
      description: "Child marriage advocacy brief (2021) · Digital landscape report · UNICEF AI Strategy for ethical AI requirements · 2007–2017 cumulative 15,000 child marriages · Factsheet EN + BM",
      sourceUrl: "https://malaysia.un.org · https://unicef.org/malaysia",
      dataTypes: "Advocacy briefs, research reports, factsheets",
      updateFrequency: "Periodic",
      accessMethod: "Public website · PDF downloads",
      relevance: "Reference for advocacy narratives and historical trends",
      notes: "Factsheet EN + BM available",
    },
    {
      name: "BMJ Open — peer-reviewed research (PMC6731912)",
      category: "Nakayama et al. · Kyoto University · 2019",
      status: "academic",
      description: "In-depth qualitative study of child marriage drivers in Kelantan: education poverty, community norms, religious framing, economic pressure, legal gaps. Used to define risk-factor model for NLP keyword taxonomy and predictive features.",
      sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6731912",
      dataTypes: "Qualitative research, risk factor analysis",
      updateFrequency: "One-time study",
      accessMethod: "DOI: 10.1136/bmjopen-2018-027377 · Open access",
      relevance: "Defines risk-factor model for NLP keyword taxonomy",
      notes: "Used to define predictive features",
    },
    {
      name: "Better Care Network · WAO · SWWS",
      category: "NGO and civil society sources",
      status: "supplementary",
      description: "Institutional care mapping · alternative care terminology · Sarawak child marriage petition data (734 signatures) · Women's Aid Organisation CRC status reports for indicator triangulation",
      sourceUrl: "https://bettercarenetwork.org · https://wao.org.my · https://sarswws.org",
      dataTypes: "Care mapping, petition data, CRC status reports",
      updateFrequency: "Periodic",
      accessMethod: "Public websites · Reports",
      relevance: "Supplementary triangulation for care facilities and marriage data",
      notes: "SWWS petition: 734 signatures",
    },
    {
      name: "PDRM — Royal Malaysian Police",
      category: "Sexual crime statistics involving children",
      status: "verified",
      description: "5,401 sexual crime cases involving children in 2023 · 2,059 cases Jan–Apr 2024 · Domestic violence: 13,529 cases 2020–2022. Used to cross-validate JKM abuse reporting and identify under-reporting gaps.",
      sourceUrl: "KPWKM parliamentary data · Galen Centre Dec 2024",
      dataTypes: "Sexual crime statistics, domestic violence data",
      updateFrequency: "Annual",
      accessMethod: "Parliamentary data via Galen Centre",
      relevance: "Cross-validation for JKM abuse reporting",
      notes: "Identifies under-reporting gaps",
    },
    {
      name: "NarrativeGPT + VRIMACPro — NLP layer",
      category: "Prototype AI pipeline · Ahmad Najmi Ariffin",
      status: "prototype",
      description: "Multilingual (BM + EN) sentiment analysis · keyword extraction · discourse topic classification · risk signal detection. Production deployment requires Twitter/X Academic API + Facebook CrowdTangle access + UNICEF Azure hosting.",
      sourceUrl: "PETRONAS-proven stack · to be deployed on UNICEF Azure",
      dataTypes: "Sentiment scores, keyword extraction, topic classification",
      updateFrequency: "Real-time (prototype)",
      accessMethod: "Prototype pipeline",
      relevance: "Core for discourse NLP monitoring module",
      notes: "Requires Twitter/X Academic API + CrowdTangle for production",
    },
  ]);

  // ── Platform Settings ───────────────────────────────────────────
  await db.insert(schema.platformSettings).values([
    { settingKey: "platform_version", value: "2.0.0", label: "Platform Version", description: "Current CRIP platform version" },
    { settingKey: "data_last_updated", value: "2026-05-23", label: "Data Last Updated", description: "Last date data sources were refreshed" },
    { settingKey: "nlp_status", value: "active", label: "NLP Pipeline Status", description: "Current status of NLP monitoring" },
    { settingKey: "risk_alert_threshold", value: "0.70", label: "Risk Alert Threshold", description: "Composite score threshold for critical alerts" },
    { settingKey: "deployment_phase", value: "Phase 1", label: "Deployment Phase", description: "Current deployment phase" },
  ]);

  console.log("Seed complete! All UNICEF Malaysia CRIP data ingested.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
