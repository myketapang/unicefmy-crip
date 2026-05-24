import { z } from "zod";
import { eq, desc, asc, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const cripRouter = createRouter({
  // ── Key Metrics ───────────────────────────────────────────────
  metrics: createRouter({
    list: publicQuery
      .input(z.object({ module: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const db = getDb();
        const conditions = [];
        if (input?.module) {
          conditions.push(eq(schema.keyMetrics.module, input.module));
        }
        const rows = await db.select().from(schema.keyMetrics)
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(asc(schema.keyMetrics.order));
        return rows;
      }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        value: z.string().optional(),
        subtext: z.string().optional(),
        status: z.enum(["critical", "high", "moderate", "positive", "neutral"]).optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.keyMetrics).set(data).where(eq(schema.keyMetrics.id, id));
        return { success: true };
      }),
  }),

  // ── State Risk Rankings ───────────────────────────────────────
  stateRisk: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.stateRiskRankings)
        .orderBy(desc(schema.stateRiskRankings.compositeScore));
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        povertyRate: z.string().optional(),
        childMarriageCases: z.number().nullable().optional(),
        abuseCases: z.number().nullable().optional(),
        compositeScore: z.string().optional(),
        riskLevel: z.enum(["critical", "high", "moderate", "monitor"]).optional(),
        priority: z.enum(["P1", "P2", "P3"]).optional(),
        notes: z.string().nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.stateRiskRankings).set(data).where(eq(schema.stateRiskRankings.id, id));
        return { success: true };
      }),
  }),

  // ── Child Marriage Data ───────────────────────────────────────
  marriage: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.childMarriageData).orderBy(asc(schema.childMarriageData.year));
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        totalCases: z.number().optional(),
        bumiputera: z.number().nullable().optional(),
        chinese: z.number().nullable().optional(),
        indian: z.number().nullable().optional(),
        others: z.number().nullable().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.childMarriageData).set(data).where(eq(schema.childMarriageData.id, id));
        return { success: true };
      }),
  }),

  // ── Abuse Cases ───────────────────────────────────────────────
  abuse: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.abuseCases).orderBy(asc(schema.abuseCases.year));
    }),

    byState: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.abuseByState).orderBy(desc(schema.abuseByState.cases));
    }),

    taska: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.taskaAbuseCases).orderBy(asc(schema.taskaAbuseCases.year));
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        totalCases: z.number().optional(),
        sexualCrimesPDRM: z.number().nullable().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.abuseCases).set(data).where(eq(schema.abuseCases.id, id));
        return { success: true };
      }),
  }),

  // ── Poverty Data ──────────────────────────────────────────────
  poverty: createRouter({
    byState: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.povertyData)
        .where(eq(schema.povertyData.isNational, 0))
        .orderBy(desc(schema.povertyData.povertyRate));
    }),

    trend: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.povertyTrend).orderBy(asc(schema.povertyTrend.year));
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        povertyRate: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.povertyData).set(data).where(eq(schema.povertyData.id, id));
        return { success: true };
      }),
  }),

  // ── Care Facilities ───────────────────────────────────────────
  facilities: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.careFacilities).orderBy(asc(schema.careFacilities.priority));
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        facilityCount: z.number().optional(),
        priority: z.enum(["P1", "P2", "P3"]).optional(),
        interventionNotes: z.string().nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.careFacilities).set(data).where(eq(schema.careFacilities.id, id));
        return { success: true };
      }),
  }),

  // ── Sentiment / Discourse ─────────────────────────────────────
  sentiment: createRouter({
    trend: publicQuery
      .input(z.object({ topic: z.string() }))
      .query(async ({ input }) => {
        const db = getDb();
        return db.select().from(schema.sentimentTrendData)
          .where(eq(schema.sentimentTrendData.topic, input.topic))
          .orderBy(asc(schema.sentimentTrendData.dayIndex));
      }),

    keywords: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.keywords).orderBy(desc(schema.keywords.frequency));
    }),

    feed: publicQuery
      .input(z.object({
        sentiment: z.string().optional(),
        region: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = getDb();
        const conditions = [];
        if (input?.sentiment) {
          conditions.push(eq(schema.discourseFeed.sentiment, input.sentiment as "positive" | "negative" | "neutral"));
        }
        if (input?.region) {
          conditions.push(eq(schema.discourseFeed.region, input.region));
        }
        return db.select().from(schema.discourseFeed)
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(schema.discourseFeed.postedAt));
      }),

    createFeed: adminQuery
      .input(z.object({
        content: z.string(),
        language: z.enum(["ms", "en"]).default("en"),
        sentiment: z.enum(["positive", "negative", "neutral"]),
        riskLevel: z.enum(["high", "medium", "low", "none"]).default("none"),
        source: z.string().optional(),
        region: z.string().optional(),
        tags: z.string().optional(),
        engagement: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.insert(schema.discourseFeed).values({ ...input, verified: 1 });
        return { success: true };
      }),

    deleteFeed: adminQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(schema.discourseFeed).where(eq(schema.discourseFeed.id, input.id));
        return { success: true };
      }),
  }),

  // ── Data Sources ──────────────────────────────────────────────
  sources: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.dataSources).orderBy(asc(schema.dataSources.id));
    }),

    create: adminQuery
      .input(z.object({
        name: z.string(),
        category: z.string().optional(),
        status: z.enum(["live", "live_api", "reference", "academic", "supplementary", "prototype", "verified"]).default("reference"),
        description: z.string().optional(),
        sourceUrl: z.string().optional(),
        dataTypes: z.string().optional(),
        updateFrequency: z.string().optional(),
        accessMethod: z.string().optional(),
        relevance: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.insert(schema.dataSources).values(input);
        return { success: true };
      }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["live", "live_api", "reference", "academic", "supplementary", "prototype", "verified"]).optional(),
        description: z.string().optional(),
        sourceUrl: z.string().optional(),
        dataTypes: z.string().optional(),
        updateFrequency: z.string().optional(),
        accessMethod: z.string().optional(),
        relevance: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(schema.dataSources).set(data).where(eq(schema.dataSources.id, id));
        return { success: true };
      }),

    delete: adminQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(schema.dataSources).where(eq(schema.dataSources.id, input.id));
        return { success: true };
      }),
  }),

  // ── Platform Settings ─────────────────────────────────────────
  settings: createRouter({
    list: publicQuery.query(async () => {
      const db = getDb();
      return db.select().from(schema.platformSettings);
    }),

    update: adminQuery
      .input(z.object({
        id: z.number(),
        value: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.update(schema.platformSettings)
          .set({ value: input.value })
          .where(eq(schema.platformSettings.id, input.id));
        return { success: true };
      }),
  }),
});
