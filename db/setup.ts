import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

const db = getDb();

async function setup() {
  console.log("Setting up UNICEF Malaysia CRIP database...");

  // Drop existing tables
  const tables = [
    'platform_settings', 'data_sources', 'keywords', 'sentiment_trend_data',
    'discourse_feed', 'care_facilities', 'poverty_trend', 'poverty_data',
    'taska_abuse_cases', 'abuse_by_state', 'abuse_cases', 'child_marriage_data',
    'state_risk_rankings', 'key_metrics'
  ];
  for (const t of tables) {
    try { await db.execute(`DROP TABLE IF EXISTS \`${t}\``); } catch(e) {}
  }

  // Create tables manually
  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`key_metrics\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`category\` varchar(50) NOT NULL,
      \`label\` varchar(200) NOT NULL,
      \`value\` varchar(100) NOT NULL,
      \`subtext\` varchar(300),
      \`status\` enum('critical','high','moderate','positive','neutral') DEFAULT 'neutral',
      \`source\` varchar(200),
      \`year\` int,
      \`module\` varchar(50) NOT NULL,
      \`order\` int DEFAULT 0,
      \`created_at\` timestamp DEFAULT NOW(),
      \`updated_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`state_risk_rankings\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`state\` varchar(50) NOT NULL,
      \`poverty_rate\` decimal(5,2),
      \`child_marriage_cases\` int,
      \`abuse_cases\` int,
      \`composite_score\` decimal(4,2) NOT NULL,
      \`risk_level\` enum('critical','high','moderate','monitor') NOT NULL,
      \`priority\` enum('P1','P2','P3') DEFAULT 'P3',
      \`dropout_marriages\` int,
      \`year\` int NOT NULL,
      \`notes\` text,
      \`created_at\` timestamp DEFAULT NOW(),
      \`updated_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`child_marriage_data\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`year\` int NOT NULL,
      \`total_cases\` int NOT NULL,
      \`bumiputera\` int,
      \`chinese\` int,
      \`indian\` int,
      \`others\` int,
      \`source\` varchar(200),
      \`verified\` int DEFAULT 1,
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`abuse_cases\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`year\` int NOT NULL,
      \`total_cases\` int NOT NULL,
      \`physical_girls\` decimal(5,1),
      \`physical_boys\` decimal(5,1),
      \`sexual_girls\` decimal(5,1),
      \`sexual_boys\` decimal(5,1),
      \`emotional_girls\` decimal(5,1),
      \`emotional_boys\` decimal(5,1),
      \`sexual_crimes_pdrm\` int,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`abuse_by_state\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`state\` varchar(50) NOT NULL,
      \`cases\` int NOT NULL,
      \`period\` varchar(50) NOT NULL,
      \`risk_level\` enum('critical','high','moderate','monitor','highest') NOT NULL,
      \`year\` int NOT NULL,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`taska_abuse_cases\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`year\` int NOT NULL,
      \`abuse_cases\` int NOT NULL,
      \`deaths\` int NOT NULL,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`poverty_data\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`state\` varchar(50) NOT NULL,
      \`poverty_rate\` decimal(5,2) NOT NULL,
      \`year\` int NOT NULL,
      \`is_national\` int DEFAULT 0,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`poverty_trend\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`year\` int NOT NULL,
      \`national_poverty_rate\` decimal(5,2) NOT NULL,
      \`poverty_line_income\` int,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`care_facilities\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`state\` varchar(50) NOT NULL,
      \`facility_count\` int NOT NULL,
      \`poverty_rate\` decimal(5,2),
      \`priority\` enum('P1','P2','P3') DEFAULT 'P3',
      \`intervention_notes\` text,
      \`year\` int NOT NULL,
      \`source\` varchar(200),
      \`created_at\` timestamp DEFAULT NOW(),
      \`updated_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`discourse_feed\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`content\` text NOT NULL,
      \`language\` enum('ms','en') DEFAULT 'en',
      \`sentiment\` enum('positive','negative','neutral') NOT NULL,
      \`risk_level\` enum('high','medium','low','none') DEFAULT 'none',
      \`source\` varchar(100),
      \`region\` varchar(50),
      \`tags\` text,
      \`engagement\` varchar(100),
      \`posted_at\` timestamp DEFAULT NOW(),
      \`verified\` int DEFAULT 0,
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`sentiment_trend_data\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`topic\` varchar(50) NOT NULL,
      \`day_index\` int NOT NULL,
      \`sentiment_score\` decimal(4,2) NOT NULL,
      \`date\` varchar(10),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`keywords\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`keyword\` varchar(100) NOT NULL,
      \`color\` varchar(20) DEFAULT '#378ADD',
      \`frequency\` int DEFAULT 0,
      \`topic\` varchar(50),
      \`created_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`data_sources\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`name\` varchar(200) NOT NULL,
      \`category\` varchar(100),
      \`status\` enum('live','live_api','reference','academic','supplementary','prototype','verified') DEFAULT 'reference',
      \`description\` text,
      \`source_url\` text,
      \`data_types\` text,
      \`update_frequency\` varchar(50),
      \`access_method\` varchar(100),
      \`relevance\` text,
      \`notes\` text,
      \`created_at\` timestamp DEFAULT NOW(),
      \`updated_at\` timestamp DEFAULT NOW()
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`platform_settings\` (
      \`id\` int AUTO_INCREMENT PRIMARY KEY,
      \`setting_key\` varchar(100) NOT NULL UNIQUE,
      \`value\` text,
      \`label\` varchar(200),
      \`description\` text,
      \`updated_at\` timestamp DEFAULT NOW()
    )
  `);

  console.log("Tables created. Inserting data...");

  // Seed key_metrics
  await db.execute(`INSERT INTO \`key_metrics\` (category, label, value, subtext, status, source, year, module, \`order\`) VALUES
    ('overview', 'Child marriages (2023)', '923', '↓ 37% from 2019 · DOSM/KPWKM', 'moderate', 'KPWKM parliamentary reply Feb 2025', 2023, 'overview', 1),
    ('overview', 'Child abuse cases (2023)', '4,469', 'JKM verified · +vs 2022', 'critical', 'JKM annual data', 2023, 'overview', 2),
    ('overview', 'National poverty rate', '6.2%', 'DOSM HIS 2022 · ↓ from 8.2%', 'moderate', 'DOSM HIES 2022', 2022, 'overview', 3),
    ('overview', 'Highest state poverty', '19.8%', 'Sabah · DOSM 2022', 'critical', 'DOSM HIES 2022', 2022, 'overview', 4),
    ('marriage', '2019 (baseline)', '1,467', 'DOSM/KPWKM', 'neutral', 'KPWKM parliamentary data', 2019, 'marriage', 1),
    ('marriage', '2023 (latest)', '923', '↓ 37% from baseline', 'positive', 'KPWKM parliamentary reply Feb 2025', 2023, 'marriage', 2),
    ('marriage', '2007–2017 total', '15,000', 'UNICEF advocacy brief', 'critical', 'UNICEF Malaysia advocacy brief 2021', 2017, 'marriage', 3),
    ('marriage', 'Bumiputera share (2020)', '91%', '1,233 of 1,354 · KPWKM', 'neutral', 'KPWKM parliamentary data', 2020, 'marriage', 4),
    ('abuse', '2020–2022 total (JKM)', '18,750', 'Physical + sexual + emotional + neglect', 'critical', 'JKM ministry data', 2022, 'abuse', 1),
    ('abuse', '2023 full year (JKM)', '4,469', 'KPWKM Dec 2024 report', 'critical', 'KPWKM Dec 2024 report', 2023, 'abuse', 2),
    ('abuse', 'Sexual crimes vs children (PDRM 2023)', '5,401', 'Royal Malaysian Police', 'critical', 'PDRM 2023 data', 2023, 'abuse', 3),
    ('abuse', 'Girls: sexual abuse share', '92.3%', '2023 · KPWKM breakdown', 'critical', 'KPWKM parliamentary data', 2023, 'abuse', 4),
    ('poverty', 'National poverty 2022', '6.2%', '↓ from 8.2% in 2021 · DOSM HIES', 'moderate', 'DOSM HIES 2022', 2022, 'poverty', 1),
    ('poverty', 'COVID impact peak (2020)', '8.4%', '580K M40 → B40 · DOSM', 'critical', 'DOSM HIES 2022', 2020, 'poverty', 2),
    ('poverty', 'Poverty Line Income 2022', 'RM 2,589', '↑ from RM 2,208 (2019) · DOSM', 'neutral', 'DOSM HIES 2022', 2022, 'poverty', 3),
    ('facilities', 'JKM registered facilities', '312', 'Institusi Kanak-Kanak', 'neutral', 'JKM registry', 2024, 'facilities', 1),
    ('facilities', 'Child protection teams', '140', 'Active nationwide · JKM 2023', 'positive', 'JKM 2023', 2023, 'facilities', 2),
    ('facilities', 'Child welfare teams', '133', 'JKM ministry statement', 'positive', 'JKM ministry', 2023, 'facilities', 3),
    ('facilities', 'KASIH prog. reach (2024)', '174K', 'Students · 337 schools', 'positive', 'KPWKM official', 2024, 'facilities', 4),
    ('sentiment', 'Corpus monitored (est. 7d)', '48.2K', 'Twitter/X + Facebook BM+EN', 'neutral', 'NarrativeGPT NLP', 2026, 'sentiment', 1),
    ('sentiment', 'Bahasa Melayu share', '71%', 'NarrativeGPT multilingual', 'neutral', 'NarrativeGPT NLP', 2026, 'sentiment', 2),
    ('sentiment', 'Child marriage mentions', '+340%', '7-day spike · Kelantan cluster', 'critical', 'NarrativeGPT NLP', 2026, 'sentiment', 3),
    ('sentiment', 'Overall sentiment', '+0.42', '−1 to +1 scale', 'positive', 'NarrativeGPT NLP', 2026, 'sentiment', 4),
    ('sources', 'Verified data sources', '7', 'Active in this platform', 'positive', 'Platform registry', 2026, 'sources', 1),
    ('sources', 'Data points ingested', '2,400+', 'Across all modules', 'neutral', 'Platform metrics', 2026, 'sources', 2),
    ('sources', 'Update frequency', 'Annual+', 'Parliamentary · Periodic surveys', 'neutral', 'Platform registry', 2026, 'sources', 3)
  `);

  // Seed state_risk_rankings
  await db.execute(`INSERT INTO \`state_risk_rankings\` (state, poverty_rate, child_marriage_cases, abuse_cases, composite_score, risk_level, priority, dropout_marriages, year, notes) VALUES
    ('Sabah', 19.80, 86, 333, 0.92, 'critical', 'P1', 86, 2023, 'Highest risk composite nationally'),
    ('Kelantan', 12.30, 43, 143, 0.81, 'critical', 'P1', 43, 2023, 'BMJ Open 2019 identifies community norms as primary drivers'),
    ('Terengganu', 11.20, NULL, NULL, 0.64, 'high', 'P2', NULL, 2023, 'East Coast cluster'),
    ('Kedah', 10.80, NULL, NULL, 0.57, 'high', 'P2', NULL, 2023, 'North cluster'),
    ('Sarawak', 7.90, 183, NULL, 0.46, 'high', 'P1', 183, 2023, 'Highest marriage dropouts nationally'),
    ('Pahang', 5.70, 38, NULL, 0.37, 'moderate', 'P3', 38, 2023, ''),
    ('Selangor', 1.50, NULL, 647, 0.26, 'monitor', 'P3', NULL, 2023, 'High abuse volume but good facility base'),
    ('Perak', 7.40, NULL, 181, 0.40, 'high', 'P2', NULL, 2023, ''),
    ('Kuala Lumpur', 0.40, NULL, 326, 0.20, 'monitor', 'P3', NULL, 2023, '')
  `);

  // Seed child_marriage_data
  await db.execute(`INSERT INTO \`child_marriage_data\` (year, total_cases, bumiputera, chinese, indian, others, source, verified) VALUES
    (2019, 1467, NULL, NULL, NULL, NULL, 'KPWKM parliamentary reply Feb 2025', 1),
    (2020, 1354, 1233, 63, 12, 46, 'KPWKM parliamentary reply May 2023', 1),
    (2021, 1086, NULL, NULL, NULL, NULL, 'KPWKM parliamentary data', 1),
    (2022, 1035, NULL, NULL, NULL, NULL, 'KPWKM parliamentary data', 1),
    (2023, 923, NULL, NULL, NULL, NULL, 'KPWKM parliamentary reply Feb 2025', 1)
  `);

  // Seed abuse_cases
  await db.execute(`INSERT INTO \`abuse_cases\` (year, total_cases, physical_girls, physical_boys, sexual_girls, sexual_boys, emotional_girls, emotional_boys, sexual_crimes_pdrm, source) VALUES
    (2020, 5900, 45.0, 55.0, 92.3, 7.7, 65.0, 35.0, NULL, 'KPWKM parliamentary replies'),
    (2021, 6200, 46.0, 54.0, 91.5, 8.5, 64.0, 36.0, NULL, 'KPWKM parliamentary replies'),
    (2022, 5650, 44.0, 56.0, 92.0, 8.0, 66.0, 34.0, NULL, 'KPWKM parliamentary replies'),
    (2023, 4469, 45.0, 55.0, 92.3, 7.7, 65.0, 35.0, 5401, 'KPWKM Dec 2024 report · PDRM'),
    (2024, 2240, NULL, NULL, NULL, NULL, NULL, NULL, 2059, 'KPWKM Feb 2025 · Jan–Aug partial')
  `);

  // Seed abuse_by_state
  await db.execute(`INSERT INTO \`abuse_by_state\` (state, cases, period, risk_level, year, source) VALUES
    ('Selangor', 647, 'Jan–May', 'highest', 2023, 'JKM ministry statement Sep 2023'),
    ('Sabah', 333, 'Jan–May', 'critical', 2023, 'JKM ministry statement Sep 2023'),
    ('Kuala Lumpur', 326, 'Jan–May', 'critical', 2023, 'JKM ministry statement Sep 2023'),
    ('Johor', 220, 'Jan–May', 'high', 2023, 'JKM ministry statement Sep 2023'),
    ('Perak', 181, 'Jan–May', 'high', 2023, 'JKM ministry statement Sep 2023'),
    ('Kelantan', 143, 'Jan–May', 'moderate', 2023, 'JKM ministry statement Sep 2023')
  `);

  // Seed taska_abuse_cases
  await db.execute(`INSERT INTO \`taska_abuse_cases\` (year, abuse_cases, deaths, source) VALUES
    (2020, 2, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2021, 7, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2022, 5, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2023, 14, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2024, 6, 4, 'KPWKM Feb 2025 · Galen Centre report')
  `);

  // Seed poverty_data
  await db.execute(`INSERT INTO \`poverty_data\` (state, poverty_rate, year, is_national, source) VALUES
    ('Sabah', 19.80, 2022, 0, 'DOSM HIES 2022'),
    ('Kelantan', 12.30, 2022, 0, 'DOSM HIES 2022'),
    ('Terengganu', 11.20, 2022, 0, 'DOSM HIES 2022'),
    ('Kedah', 10.80, 2022, 0, 'DOSM HIES 2022'),
    ('Perak', 7.40, 2022, 0, 'DOSM HIES 2022'),
    ('Sarawak', 7.90, 2022, 0, 'DOSM HIES 2022'),
    ('Pahang', 5.70, 2022, 0, 'DOSM HIES 2022'),
    ('Selangor', 1.50, 2022, 0, 'DOSM HIES 2022'),
    ('Kuala Lumpur', 0.40, 2022, 0, 'DOSM HIES 2022'),
    ('Malaysia', 6.20, 2022, 1, 'DOSM HIES 2022')
  `);

  // Seed poverty_trend
  await db.execute(`INSERT INTO \`poverty_trend\` (year, national_poverty_rate, poverty_line_income, source) VALUES
    (2016, 0.40, 2208, 'DOSM HIES historical'),
    (2019, 5.60, 2208, 'DOSM HIES 2022'),
    (2020, 8.40, 2500, 'DOSM · PM Ismail Sabri 2021'),
    (2021, 8.20, 2500, 'DOSM HIES 2022'),
    (2022, 6.20, 2589, 'DOSM HIES 2022')
  `);

  // Seed care_facilities
  await db.execute(`INSERT INTO \`care_facilities\` (state, facility_count, poverty_rate, priority, intervention_notes, year, source) VALUES
    ('Sabah', 27, 19.80, 'P1', 'Poverty 19.8% · 86 child marriages · 333 abuse cases · Interior district gaps', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Kelantan', 18, 12.30, 'P1', 'Poverty 12.3% · BMJ risk factors · Marriage spike', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Sarawak', 24, 7.90, 'P1', 'Highest marriage dropouts (183) · Facility gap · Rural access issues', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Terengganu', 12, 11.20, 'P2', 'Poverty 11.2% · East Coast cluster', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Kedah', 15, 10.80, 'P2', 'Poverty 10.8% · North cluster', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Pahang', 14, 5.70, 'P3', 'Moderate risk', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Perak', 21, 7.40, 'P2', 'Poverty 7.4%', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Selangor', 52, 1.50, 'P3', 'High abuse volume · Good facility base', 2024, 'JKM registry · DOSM HIES 2022')
  `);

  // Seed discourse_feed
  await db.execute(`INSERT INTO \`discourse_feed\` (content, language, sentiment, risk_level, source, region, tags, engagement, posted_at, verified) VALUES
    ('Perkahwinan kanak-kanak mesti dihentikan — undang-undang tidak mencukupi perlindungan', 'ms', 'negative', 'high', 'Twitter/X', 'Kelantan', 'child marriage,Kelantan', '1.2K RT · 2h ago', NOW() - INTERVAL 2 HOUR, 1),
    ('UNICEF Malaysia: New child protection programme launched under National Strategic Plan 2020–2025', 'en', 'positive', 'none', 'Berita Harian', 'National', 'UNICEF,policy', 'National · 5h ago', NOW() - INTERVAL 5 HOUR, 1),
    ('Kes penganiayaan kanak-kanak di TASKA meningkat — perlu tindakan segera', 'ms', 'negative', 'high', 'Facebook', 'National', 'TASKA,JKM', '890 shares · 8h ago', NOW() - INTERVAL 8 HOUR, 1),
    ('Child marriages down 37% from 2019 to 2023 — Minister Nancy Shukri cites National Strategic Plan success', 'en', 'neutral', 'none', 'FMT', 'National', 'policy progress', 'National · 12h ago', NOW() - INTERVAL 12 HOUR, 1),
    ('KASIH Kanak-Kanak programme reaches 174,079 students in 337 schools — community response positive', 'en', 'positive', 'none', 'KPWKM official', 'National', 'prevention', 'Facebook · 24h ago', NOW() - INTERVAL 24 HOUR, 1),
    ('Rumah perlindungan kanak-kanak di Kelantan kekurangan tempat — kebajikan tidak terbela', 'ms', 'negative', 'medium', 'Twitter/X', 'Kelantan', 'shelter,Kelantan', '456 RT · 1d ago', NOW() - INTERVAL 36 HOUR, 0),
    ('Sabah interior children face education poverty — schools too far, dropout rates alarming', 'en', 'negative', 'high', 'Facebook', 'Sabah', 'education poverty,Sabah', '1.1K shares · 1d ago', NOW() - INTERVAL 40 HOUR, 1),
    ('JKM deploys 140 child protection teams nationwide — coverage improving', 'en', 'positive', 'none', 'NST', 'National', 'JKM,protection', 'National · 2d ago', NOW() - INTERVAL 48 HOUR, 1)
  `);

  // Seed keywords
  await db.execute(`INSERT INTO \`keywords\` (keyword, color, frequency, topic) VALUES
    ('perlindungan kanak-kanak', '#378ADD', 1240, 'protection'),
    ('child marriage', '#E24B4A', 980, 'marriage'),
    ('perkahwinan kanak-kanak', '#E24B4A', 870, 'marriage'),
    ('JKM', '#378ADD', 750, 'institution'),
    ('UNICEF', '#639922', 720, 'institution'),
    ('kemiskinan', '#BA7517', 680, 'poverty'),
    ('hak kanak-kanak', '#639922', 650, 'rights'),
    ('rumah perlindungan', '#BA7517', 540, 'shelter'),
    ('TASKA', '#E24B4A', 510, 'abuse'),
    ('Nancy Shukri', '#378ADD', 480, 'policy'),
    ('Kelantan', '#E24B4A', 920, 'region'),
    ('Sabah', '#E24B4A', 890, 'region'),
    ('sekolah', '#639922', 760, 'education'),
    ('poverty', '#BA7517', 700, 'poverty'),
    ('child rights', '#639922', 620, 'rights')
  `);

  // Seed data_sources
  await db.execute(`INSERT INTO \`data_sources\` (name, category, status, description, source_url, data_types, update_frequency, access_method, relevance, notes) VALUES
    ('JKM / KPWKM — Social Welfare Department', 'Ministry of Women, Family and Community Development', 'live', 'Child abuse & neglect cases (2020–2024) · Child marriage statistics · TASKA enforcement records · Child protection team deployment', 'https://www.kpwkm.gov.my', 'Child abuse cases, marriage statistics, TASKA records, protection teams', 'Annual', 'Parliamentary records · Ministry press releases', 'Core data source for abuse, marriage, and facility modules', 'Primary government source'),
    ('DOSM — Department of Statistics Malaysia', 'OpenDOSM · data.gov.my open API (CC BY 4.0)', 'live_api', 'HIES 2022: poverty by state/district/constituency · Population by state/age/ethnicity · Births & vital statistics', 'https://api.data.gov.my', 'Poverty rates, household income, population demographics', 'Annual (HIES)', 'Open API · No auth required · CC BY 4.0', 'Core data source for poverty and risk mapping modules', 'All data under CC BY 4.0 open licence'),
    ('UNICEF Malaysia — advocacy & research', 'UN Malaysia country office publications', 'reference', 'Child marriage advocacy brief (2021) · Digital landscape report · UNICEF AI Strategy · 2007–2017 cumulative 15,000 child marriages', 'https://malaysia.un.org', 'Advocacy briefs, research reports, factsheets', 'Periodic', 'Public website · PDF downloads', 'Reference for advocacy narratives and historical trends', 'Factsheet EN + BM available'),
    ('BMJ Open — peer-reviewed research (PMC6731912)', 'Nakayama et al. · Kyoto University · 2019', 'academic', 'In-depth qualitative study of child marriage drivers in Kelantan: education poverty, community norms, religious framing, economic pressure, legal gaps', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6731912', 'Qualitative research, risk factor analysis', 'One-time study', 'DOI: 10.1136/bmjopen-2018-027377', 'Defines risk-factor model for NLP keyword taxonomy', 'Used to define predictive features'),
    ('Better Care Network · WAO · SWWS', 'NGO and civil society sources', 'supplementary', 'Institutional care mapping · alternative care terminology · Sarawak child marriage petition data (734 signatures)', 'https://bettercarenetwork.org', 'Care mapping, petition data, CRC status reports', 'Periodic', 'Public websites · Reports', 'Supplementary triangulation for care facilities and marriage data', 'SWWS petition: 734 signatures'),
    ('PDRM — Royal Malaysian Police', 'Sexual crime statistics involving children', 'verified', '5,401 sexual crime cases involving children in 2023 · 2,059 cases Jan–Apr 2024 · Domestic violence: 13,529 cases 2020–2022', 'KPWKM parliamentary data', 'Sexual crime statistics, domestic violence data', 'Annual', 'Parliamentary data via Galen Centre', 'Cross-validation for JKM abuse reporting', 'Identifies under-reporting gaps'),
    ('NarrativeGPT + VRIMACPro — NLP layer', 'Prototype AI pipeline · Ahmad Najmi Ariffin', 'prototype', 'Multilingual (BM + EN) sentiment analysis · keyword extraction · discourse topic classification · risk signal detection', 'PETRONAS-proven stack', 'Sentiment scores, keyword extraction, topic classification', 'Real-time (prototype)', 'Prototype pipeline', 'Core for discourse NLP monitoring module', 'Requires Twitter/X Academic API + CrowdTangle for production')
  `);

  // Seed platform_settings
  await db.execute(`INSERT INTO \`platform_settings\` (setting_key, value, label, description) VALUES
    ('platform_version', '2.0.0', 'Platform Version', 'Current CRIP platform version'),
    ('data_last_updated', '2026-05-23', 'Data Last Updated', 'Last date data sources were refreshed'),
    ('nlp_status', 'active', 'NLP Pipeline Status', 'Current status of NLP monitoring'),
    ('risk_alert_threshold', '0.70', 'Risk Alert Threshold', 'Composite score threshold for critical alerts'),
    ('deployment_phase', 'Phase 1', 'Deployment Phase', 'Current deployment phase')
  `);

  console.log("Database setup complete with all UNICEF Malaysia CRIP data!");
}

setup().catch(console.error);
