import { getDb } from "../api/queries/connection";

const db = getDb();

async function reset() {
  const tables = [
    'platform_settings', 'data_sources', 'keywords', 'sentiment_trend_data',
    'discourse_feed', 'care_facilities', 'poverty_trend', 'poverty_data',
    'taska_abuse_cases', 'abuse_by_state', 'abuse_cases', 'child_marriage_data',
    'state_risk_rankings', 'key_metrics'
  ];
  for (const t of tables) {
    try {
      await db.execute(`DROP TABLE IF EXISTS \`${t}\``);
      console.log('Dropped ' + t);
    } catch(e: any) {
      console.log('Skip ' + t + ': ' + e.message);
    }
  }
  console.log('Reset complete');
}

reset().catch(console.error);
