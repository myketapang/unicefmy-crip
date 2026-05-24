import { relations } from "drizzle-orm";
import { users } from "./schema";

export const usersRelations = relations(users, () => ({
  // placeholder for future relations
}));
