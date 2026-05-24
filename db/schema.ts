import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
} from "drizzle-orm/mysql-core";

// ── Users (auth system) ──────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Key Metrics (overview dashboard cards) ────────────────────────
export const keyMetrics = mysqlTable("key_metrics", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  subtext: varchar("subtext", { length: 300 }),
  status: mysqlEnum("status", ["critical", "high", "moderate", "positive", "neutral"]).default("neutral"),
  source: varchar("source", { length: 200 }),
  year: int("year"),
  module: varchar("module", { length: 50 }).notNull(),
  order: int("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── State Risk Rankings ───────────────────────────────────────────
export const stateRiskRankings = mysqlTable("state_risk_rankings", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 50 }).notNull(),
  povertyRate: decimal("poverty_rate", { precision: 5, scale: 2 }),
  childMarriageCases: int("child_marriage_cases"),
  abuseCases: int("abuse_cases"),
  compositeScore: decimal("composite_score", { precision: 4, scale: 2 }).notNull(),
  riskLevel: mysqlEnum("risk_level", ["critical", "high", "moderate", "monitor"]).notNull(),
  priority: mysqlEnum("priority", ["P1", "P2", "P3"]).default("P3"),
  dropoutMarriages: int("dropout_marriages"),
  year: int("year").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Child Marriage Data ───────────────────────────────────────────
export const childMarriageData = mysqlTable("child_marriage_data", {
  id: serial("id").primaryKey(),
  year: int("year").notNull(),
  totalCases: int("total_cases").notNull(),
  bumiputera: int("bumiputera"),
  chinese: int("chinese"),
  indian: int("indian"),
  others: int("others"),
  source: varchar("source", { length: 200 }),
  verified: int("verified").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Abuse Cases ───────────────────────────────────────────────────
export const abuseCases = mysqlTable("abuse_cases", {
  id: serial("id").primaryKey(),
  year: int("year").notNull(),
  totalCases: int("total_cases").notNull(),
  physicalGirls: decimal("physical_girls", { precision: 5, scale: 1 }),
  physicalBoys: decimal("physical_boys", { precision: 5, scale: 1 }),
  sexualGirls: decimal("sexual_girls", { precision: 5, scale: 1 }),
  sexualBoys: decimal("sexual_boys", { precision: 5, scale: 1 }),
  emotionalGirls: decimal("emotional_girls", { precision: 5, scale: 1 }),
  emotionalBoys: decimal("emotional_boys", { precision: 5, scale: 1 }),
  sexualCrimesPDRM: int("sexual_crimes_pdrm"),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Abuse by State ────────────────────────────────────────────────
export const abuseByState = mysqlTable("abuse_by_state", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 50 }).notNull(),
  cases: int("cases").notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  riskLevel: mysqlEnum("risk_level", ["critical", "high", "moderate", "monitor", "highest"]).notNull(),
  year: int("year").notNull(),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── TASKA Abuse Cases ─────────────────────────────────────────────
export const taskaAbuseCases = mysqlTable("taska_abuse_cases", {
  id: serial("id").primaryKey(),
  year: int("year").notNull(),
  abuseCases: int("abuse_cases").notNull(),
  deaths: int("deaths").notNull(),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Poverty Data ──────────────────────────────────────────────────
export const povertyData = mysqlTable("poverty_data", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 50 }).notNull(),
  povertyRate: decimal("poverty_rate", { precision: 5, scale: 2 }).notNull(),
  year: int("year").notNull(),
  isNational: int("is_national").default(0),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Poverty Trend ─────────────────────────────────────────────────
export const povertyTrend = mysqlTable("poverty_trend", {
  id: serial("id").primaryKey(),
  year: int("year").notNull(),
  nationalPovertyRate: decimal("national_poverty_rate", { precision: 5, scale: 2 }).notNull(),
  povertyLineIncome: int("poverty_line_income"),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Care Facilities ───────────────────────────────────────────────
export const careFacilities = mysqlTable("care_facilities", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 50 }).notNull(),
  facilityCount: int("facility_count").notNull(),
  povertyRate: decimal("poverty_rate", { precision: 5, scale: 2 }),
  priority: mysqlEnum("priority", ["P1", "P2", "P3"]).default("P3"),
  interventionNotes: text("intervention_notes"),
  year: int("year").notNull(),
  source: varchar("source", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Discourse Feed (NLP sentiment data) ───────────────────────────
export const discourseFeed = mysqlTable("discourse_feed", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  language: mysqlEnum("language", ["ms", "en"]).default("en"),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]).notNull(),
  riskLevel: mysqlEnum("risk_level", ["high", "medium", "low", "none"]).default("none"),
  source: varchar("source", { length: 100 }),
  region: varchar("region", { length: 50 }),
  tags: text("tags"),
  engagement: varchar("engagement", { length: 100 }),
  postedAt: timestamp("posted_at").defaultNow(),
  verified: int("verified").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Sentiment Trend Data ──────────────────────────────────────────
export const sentimentTrendData = mysqlTable("sentiment_trend_data", {
  id: serial("id").primaryKey(),
  topic: varchar("topic", { length: 50 }).notNull(),
  dayIndex: int("day_index").notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 4, scale: 2 }).notNull(),
  date: varchar("date", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Keywords ──────────────────────────────────────────────────────
export const keywords = mysqlTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: varchar("keyword", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).default("#378ADD"),
  frequency: int("frequency").default(0),
  topic: varchar("topic", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Data Sources ──────────────────────────────────────────────────
export const dataSources = mysqlTable("data_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }),
  status: mysqlEnum("status", ["live", "live_api", "reference", "academic", "supplementary", "prototype", "verified"]).default("reference"),
  description: text("description"),
  sourceUrl: text("source_url"),
  dataTypes: text("data_types"),
  updateFrequency: varchar("update_frequency", { length: 50 }),
  accessMethod: varchar("access_method", { length: 100 }),
  relevance: text("relevance"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Platform Settings ─────────────────────────────────────────────
export const platformSettings = mysqlTable("platform_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  value: text("value"),
  label: varchar("label", { length: 200 }),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
