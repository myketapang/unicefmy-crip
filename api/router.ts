import { authRouter } from "./auth-router";
import { cripRouter } from "./crip-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  crip: cripRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
