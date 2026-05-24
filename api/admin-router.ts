import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const adminRouter = createRouter({
  users: createRouter({
    list: adminQuery.query(async () => {
      const db = getDb();
      return db.select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
        lastSignInAt: schema.users.lastSignInAt,
        avatar: schema.users.avatar,
      }).from(schema.users).orderBy(desc(schema.users.createdAt));
    }),

    updateRole: adminQuery
      .input(z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.update(schema.users)
          .set({ role: input.role })
          .where(eq(schema.users.id, input.id));
        return { success: true };
      }),

    stats: adminQuery.query(async () => {
      const db = getDb();
      const allUsers = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
      const adminUsers = await db.select({ count: sql<number>`count(*)` }).from(schema.users).where(eq(schema.users.role, "admin"));
      return {
        totalUsers: allUsers[0]?.count ?? 0,
        adminCount: adminUsers[0]?.count ?? 0,
      };
    }),
  }),
});
