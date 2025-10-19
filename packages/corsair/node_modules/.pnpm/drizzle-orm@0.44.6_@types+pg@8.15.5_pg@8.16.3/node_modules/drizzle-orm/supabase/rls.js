import { bigserial, pgSchema, text, timestamp, uuid, varchar } from "../pg-core/index.js";
import { pgRole } from "../pg-core/roles.js";
import { sql } from "../sql/sql.js";
const anonRole = pgRole("anon").existing();
const authenticatedRole = pgRole("authenticated").existing();
const serviceRole = pgRole("service_role").existing();
const postgresRole = pgRole("postgres_role").existing();
const supabaseAuthAdminRole = pgRole("supabase_auth_admin").existing();
const auth = pgSchema("auth");
const authUsers = auth.table("users", {
  id: uuid().primaryKey().notNull(),
  email: varchar({ length: 255 }),
  phone: text().unique(),
  emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
  phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true }),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
});
const realtime = pgSchema("realtime");
const realtimeMessages = realtime.table(
  "messages",
  {
    id: bigserial({ mode: "bigint" }).primaryKey(),
    topic: text().notNull(),
    extension: text({
      enum: ["presence", "broadcast", "postgres_changes"]
    }).notNull()
  }
);
const authUid = sql`(select auth.uid())`;
const realtimeTopic = sql`realtime.topic()`;
export {
  anonRole,
  authUid,
  authUsers,
  authenticatedRole,
  postgresRole,
  realtimeMessages,
  realtimeTopic,
  serviceRole,
  supabaseAuthAdminRole
};
//# sourceMappingURL=rls.js.map