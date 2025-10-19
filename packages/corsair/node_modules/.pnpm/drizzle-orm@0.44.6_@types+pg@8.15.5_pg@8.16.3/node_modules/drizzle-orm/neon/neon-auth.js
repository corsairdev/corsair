import { jsonb, pgSchema, text, timestamp } from "../pg-core/index.js";
const neonAuthSchema = pgSchema("neon_auth");
const usersSync = neonAuthSchema.table("users_sync", {
  rawJson: jsonb("raw_json").notNull(),
  id: text().primaryKey().notNull(),
  name: text(),
  email: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
});
export {
  usersSync
};
//# sourceMappingURL=neon-auth.js.map