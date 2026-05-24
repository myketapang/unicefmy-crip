const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  const db = drizzle(pool);

  // Clear all tables
  const tables = [
    'platform_settings', 'data_sources', 'keywords', 'sentiment_trend_data',
    'discourse_feed', 'care_facilities', 'poverty_trend', 'poverty_data',
    'taska_abuse_cases', 'abuse_by_state', 'abuse_cases', 'child_marriage_data',
    'state_risk_rankings', 'key_metrics'
  ];

  for (const t of tables) {
    try { await db.execute(`DELETE FROM \`${t}\``); console.log('Cleared', t); } catch(e) { console.log('Skip', t, e.message); }
  }

  // Seed key_metrics
  await db.execute(`INSERT INTO key_metrics (category, label, value, subtext, status, source, year, module, \`order\`) VALUES
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
    ('sources', 'Update frequency', 'Annual+', 'Parliamentary · Periodic surveys', 'neutral', 'Platform registry', 2026, 'sources', 3)`);

  await db.execute(`INSERT INTO state_risk_rankings (state, poverty_rate, child_marriage_cases, abuse_cases, composite_score, risk_level, priority, dropout_marriages, year, notes) VALUES
    ('Sabah', 19.80, 86, 333, 0.92, 'critical', 'P1', 86, 2023, 'Highest risk composite nationally'),
    ('Kelantan', 12.30, 43, 143, 0.81, 'critical', 'P1', 43, 2023, 'BMJ Open 2019 identifies community norms as primary drivers'),
    ('Terengganu', 11.20, NULL, NULL, 0.64, 'high', 'P2', NULL, 2023, 'East Coast cluster'),
    ('Kedah', 10.80, NULL, NULL, 0.57, 'high', 'P2', NULL, 2023, 'North cluster'),
    ('Sarawak', 7.90, 183, NULL, 0.46, 'high', 'P1', 183, 2023, 'Highest marriage dropouts nationally'),
    ('Pahang', 5.70, 38, NULL, 0.37, 'moderate', 'P3', 38, 2023, ''),
    ('Selangor', 1.50, NULL, 647, 0.26, 'monitor', 'P3', NULL, 2023, 'High abuse volume but good facility base'),
    ('Perak', 7.40, NULL, 181, 0.40, 'high', 'P2', NULL, 2023, ''),
    ('Kuala Lumpur', 0.40, NULL, 326, 0.20, 'monitor', 'P3', NULL, 2023, '')`);

  await db.execute(`INSERT INTO child_marriage_data (year, total_cases, bumiputera, chinese, indian, others, source, verified) VALUES
    (2019, 1467, NULL, NULL, NULL, NULL, 'KPWKM parliamentary reply Feb 2025', 1),
    (2020, 1354, 1233, 63, 12, 46, 'KPWKM parliamentary reply May 2023', 1),
    (2021, 1086, NULL, NULL, NULL, NULL, 'KPWKM parliamentary data', 1),
    (2022, 1035, NULL, NULL, NULL, NULL, 'KPWKM parliamentary data', 1),
    (2023, 923, NULL, NULL, NULL, NULL, 'KPWKM parliamentary reply Feb 2025', 1)`);

  await db.execute(`INSERT INTO abuse_cases (year, total_cases, physical_girls, physical_boys, sexual_girls, sexual_boys, emotional_girls, emotional_boys, sexual_crimes_pdrm, source) VALUES
    (2020, 5900, 45.0, 55.0, 92.3, 7.7, 65.0, 35.0, NULL, 'KPWKM parliamentary replies'),
    (2021, 6200, 46.0, 54.0, 91.5, 8.5, 64.0, 36.0, NULL, 'KPWKM parliamentary replies'),
    (2022, 5650, 44.0, 56.0, 92.0, 8.0, 66.0, 34.0, NULL, 'KPWKM parliamentary replies'),
    (2023, 4469, 45.0, 55.0, 92.3, 7.7, 65.0, 35.0, 5401, 'KPWKM Dec 2024 report · PDRM'),
    (2024, 2240, NULL, NULL, NULL, NULL, NULL, NULL, 2059, 'KPWKM Feb 2025 · Jan–Aug partial')`);

  await db.execute(`INSERT INTO abuse_by_state (state, cases, period, risk_level, year, source) VALUES
    ('Selangor', 647, 'Jan–May', 'highest', 2023, 'JKM ministry statement Sep 2023'),
    ('Sabah', 333, 'Jan–May', 'critical', 2023, 'JKM ministry statement Sep 2023'),
    ('Kuala Lumpur', 326, 'Jan–May', 'critical', 2023, 'JKM ministry statement Sep 2023'),
    ('Johor', 220, 'Jan–May', 'high', 2023, 'JKM ministry statement Sep 2023'),
    ('Perak', 181, 'Jan–May', 'high', 2023, 'JKM ministry statement Sep 2023'),
    ('Kelantan', 143, 'Jan–May', 'moderate', 2023, 'JKM ministry statement Sep 2023')`);

  await db.execute(`INSERT INTO taska_abuse_cases (year, abuse_cases, deaths, source) VALUES
    (2020, 2, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2021, 7, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2022, 5, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2023, 14, 1, 'KPWKM Feb 2025 · Galen Centre report'),
    (2024, 6, 4, 'KPWKM Feb 2025 · Galen Centre report')`);

  await db.execute(`INSERT INTO poverty_data (state, poverty_rate, year, is_national, source) VALUES
    ('Sabah', 19.80, 2022, 0, 'DOSM HIES 2022'),
    ('Kelantan', 12.30, 2022, 0, 'DOSM HIES 2022'),
    ('Terengganu', 11.20, 2022, 0, 'DOSM HIES 2022'),
    ('Kedah', 10.80, 2022, 0, 'DOSM HIES 2022'),
    ('Perak', 7.40, 2022, 0, 'DOSM HIES 2022'),
    ('Sarawak', 7.90, 2022, 0, 'DOSM HIES 2022'),
    ('Pahang', 5.70, 2022, 0, 'DOSM HIES 2022'),
    ('Selangor', 1.50, 2022, 0, 'DOSM HIES 2022'),
    ('Kuala Lumpur', 0.40, 2022, 0, 'DOSM HIES 2022'),
    ('Malaysia', 6.20, 2022, 1, 'DOSM HIES 2022')`);

  await db.execute(`INSERT INTO poverty_trend (year, national_poverty_rate, poverty_line_income, source) VALUES
    (2016, 0.40, 2208, 'DOSM HIES historical'),
    (2019, 5.60, 2208, 'DOSM HIES 2022'),
    (2020, 8.40, 2500, 'DOSM · PM Ismail Sabri 2021'),
    (2021, 8.20, 2500, 'DOSM HIES 2022'),
    (2022, 6.20, 2589, 'DOSM HIES 2022')`);

  await db.execute(`INSERT INTO care_facilities (state, facility_count, poverty_rate, priority, intervention_notes, year, source) VALUES
    ('Sabah', 27, 19.80, 'P1', 'Poverty 19.8% · 86 child marriages · 333 abuse cases', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Kelantan', 18, 12.30, 'P1', 'Poverty 12.3% · BMJ risk factors · Marriage spike', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Sarawak', 24, 7.90, 'P1', 'Highest marriage dropouts (183) · Facility gap', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Terengganu', 12, 11.20, 'P2', 'Poverty 11.2% · East Coast cluster', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Kedah', 15, 10.80, 'P2', 'Poverty 10.8% · North cluster', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Pahang', 14, 5.70, 'P3', 'Moderate risk', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Perak', 21, 7.40, 'P2', 'Poverty 7.4%', 2024, 'JKM registry · DOSM HIES 2022'),
    ('Selangor', 52, 1.50, 'P3', 'High abuse volume · Good facility base', 2024, 'JKM registry · DOSM HIES 2022')`);

  await db.execute(`INSERT INTO discourse_feed (content, language, sentiment, risk_level, source, region, tags, engagement, verified) VALUES
    ('Perkahwinan kanak-kanak mesti dihentikan — undang-undang tidak mencukupi perlindungan', 'ms', 'negative', 'high', 'Twitter/X', 'Kelantan', 'child marriage,Kelantan', '1.2K RT · 2h ago', 1),
    ('UNICEF Malaysia: New child protection programme launched under National Strategic Plan 2020–2025', 'en', 'positive', 'none', 'Berita Harian', 'National', 'UNICEF,policy', 'National · 5h ago', 1),
    ('Kes penganiayaan kanak-kanak di TASKA meningkat — perlu tindakan segera', 'ms', 'negative', 'high', 'Facebook', 'National', 'TASKA,JKM', '890 shares · 8h ago', 1),
    ('Child marriages down 37% from 2019 to 2023 — Minister Nancy Shukri cites National Strategic Plan success', 'en', 'neutral', 'none', 'FMT', 'National', 'policy progress', 'National · 12h ago', 1),
    ('KASIH Kanak-Kanak programme reaches 174,079 students in 337 schools — community response positive', 'en', 'positive', 'none', 'KPWKM official', 'National', 'prevention', 'Facebook · 24h ago', 1),
    ('Rumah perlindungan kanak-kanak di Kelantan kekurangan tempat — kebajikan tidak terbela', 'ms', 'negative', 'medium', 'Twitter/X', 'Kelantan', 'shelter,Kelantan', '456 RT · 1d ago', 0),
    ('Sabah interior children face education poverty — schools too far, dropout rates alarming', 'en', 'negative', 'high', 'Facebook', 'Sabah', 'education poverty,Sabah', '1.1K shares · 1d ago', 1),
    ('JKM deploys 140 child protection teams nationwide — coverage improving', 'en', 'positive', 'none', 'NST', 'National', 'JKM,protection', 'National · 2d ago', 1)`);

  await db.execute(`INSERT INTO keywords (keyword, color, frequency, topic) VALUES
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
    ('child rights', '#639922', 620, 'rights')`);

  await db.execute(`INSERT INTO data_sources (name, category, status, description, source_url, data_types, update_frequency, access_method, relevance, notes) VALUES
    ('JKM / KPWKM — Social Welfare Department', 'Ministry of Women, Family and Community Development', 'live', 'Child abuse & neglect cases · Child marriage statistics · TASKA enforcement · Child protection teams', 'https://www.kpwkm.gov.my', 'Child abuse, marriage stats, TASKA, protection teams', 'Annual', 'Parliamentary records', 'Core for abuse, marriage, facility modules', 'Primary government source'),
    ('DOSM — Department of Statistics Malaysia', 'OpenDOSM · data.gov.my open API', 'live_api', 'HIES 2022 poverty · Population · Births · Gini coefficient · Household income', 'https://api.data.gov.my', 'Poverty rates, demographics, income', 'Annual (HIES)', 'Open API · CC BY 4.0', 'Core for poverty and risk mapping', 'Open licence'),
    ('UNICEF Malaysia — advocacy & research', 'UN Malaysia country office', 'reference', 'Child marriage advocacy brief · Digital landscape · 2007–2017 15,000 child marriages', 'https://malaysia.un.org', 'Advocacy briefs, research reports', 'Periodic', 'Public website', 'Reference for advocacy narratives', 'EN + BM factsheets'),
    ('BMJ Open — peer-reviewed research', 'Nakayama et al. · Kyoto University · 2019', 'academic', 'Child marriage drivers in Kelantan: education poverty, norms, religious framing, legal gaps', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6731912', 'Qualitative research', 'One-time study', 'DOI open access', 'Defines NLP risk-factor taxonomy', 'PMC6731912'),
    ('Better Care Network · WAO · SWWS', 'NGO and civil society sources', 'supplementary', 'Care mapping · Sarawak petition (734 signatures) · CRC status reports', 'https://bettercarenetwork.org', 'Care mapping, petition data', 'Periodic', 'Public websites', 'Supplementary triangulation', 'SWWS: 734 signatures'),
    ('PDRM — Royal Malaysian Police', 'Sexual crime statistics', 'verified', '5,401 sexual crime cases 2023 · 2,059 Jan–Apr 2024 · Domestic violence 13,529 (2020–2022)', 'KPWKM parliamentary data', 'Sexual crime, domestic violence', 'Annual', 'Parliamentary data', 'Cross-validation for JKM abuse', 'Identifies under-reporting'),
    ('NarrativeGPT + VRIMACPro — NLP layer', 'Prototype AI pipeline', 'prototype', 'BM+EN sentiment analysis · keyword extraction · topic classification · risk detection', 'PETRONAS-proven stack', 'Sentiment, keywords, topics', 'Real-time', 'Prototype pipeline', 'Core for NLP monitoring', 'Needs Twitter/X API for production')`);

  await db.execute(`INSERT INTO platform_settings (setting_key, value, label, description) VALUES
    ('platform_version', '2.0.0', 'Platform Version', 'Current CRIP platform version'),
    ('data_last_updated', '2026-05-23', 'Data Last Updated', 'Last date data sources were refreshed'),
    ('nlp_status', 'active', 'NLP Pipeline Status', 'Current status of NLP monitoring'),
    ('risk_alert_threshold', '0.70', 'Risk Alert Threshold', 'Composite score threshold for critical alerts'),
    ('deployment_phase', 'Phase 1', 'Deployment Phase', 'Current deployment phase')`);

  // Seed sentiment_trend_data (bulk insert)
  const allScores = [0.38,0.41,0.35,0.28,0.22,0.19,0.25,0.30,0.38,0.42,0.45,0.48,0.51,0.46,0.40,0.38,0.42,0.44,0.40,0.35,0.30,0.25,0.20,0.18,0.28,0.38,0.42,0.45,0.43,0.42];
  const marriageScores = [-0.2,-0.18,-0.25,-0.35,-0.42,-0.5,-0.45,-0.38,-0.3,-0.25,-0.2,-0.28,-0.35,-0.4,-0.48,-0.55,-0.6,-0.58,-0.52,-0.48,-0.42,-0.38,-0.32,-0.4,-0.48,-0.52,-0.58,-0.62,-0.6,-0.58];
  const abuseScores = [-0.1,-0.08,-0.12,-0.18,-0.22,-0.28,-0.24,-0.2,-0.15,-0.1,-0.08,-0.12,-0.18,-0.22,-0.28,-0.32,-0.35,-0.38,-0.35,-0.3,-0.25,-0.2,-0.18,-0.22,-0.28,-0.32,-0.35,-0.38,-0.4,-0.42];

  const now = new Date();
  let sentimentValues = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now); d.setDate(d.getDate() - 29 + i);
    const dateStr = (d.getMonth()+1) + '/' + d.getDate();
    sentimentValues.push(`('all', ${i}, ${allScores[i]}, '${dateStr}')`);
    sentimentValues.push(`('marriage', ${i}, ${marriageScores[i]}, '${dateStr}')`);
    sentimentValues.push(`('abuse', ${i}, ${abuseScores[i]}, '${dateStr}')`);
  }
  await db.execute(`INSERT INTO sentiment_trend_data (topic, day_index, sentiment_score, date) VALUES ${sentimentValues.join(',')}`);

  console.log('Seed complete!');
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
