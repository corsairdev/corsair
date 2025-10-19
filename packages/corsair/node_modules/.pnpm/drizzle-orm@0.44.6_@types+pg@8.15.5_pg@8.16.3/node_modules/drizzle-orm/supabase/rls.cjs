"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var rls_exports = {};
__export(rls_exports, {
  anonRole: () => anonRole,
  authUid: () => authUid,
  authUsers: () => authUsers,
  authenticatedRole: () => authenticatedRole,
  postgresRole: () => postgresRole,
  realtimeMessages: () => realtimeMessages,
  realtimeTopic: () => realtimeTopic,
  serviceRole: () => serviceRole,
  supabaseAuthAdminRole: () => supabaseAuthAdminRole
});
module.exports = __toCommonJS(rls_exports);
var import_pg_core = require("../pg-core/index.cjs");
var import_roles = require("../pg-core/roles.cjs");
var import_sql = require("../sql/sql.cjs");
const anonRole = (0, import_roles.pgRole)("anon").existing();
const authenticatedRole = (0, import_roles.pgRole)("authenticated").existing();
const serviceRole = (0, import_roles.pgRole)("service_role").existing();
const postgresRole = (0, import_roles.pgRole)("postgres_role").existing();
const supabaseAuthAdminRole = (0, import_roles.pgRole)("supabase_auth_admin").existing();
const auth = (0, import_pg_core.pgSchema)("auth");
const authUsers = auth.table("users", {
  id: (0, import_pg_core.uuid)().primaryKey().notNull(),
  email: (0, import_pg_core.varchar)({ length: 255 }),
  phone: (0, import_pg_core.text)().unique(),
  emailConfirmedAt: (0, import_pg_core.timestamp)("email_confirmed_at", { withTimezone: true }),
  phoneConfirmedAt: (0, import_pg_core.timestamp)("phone_confirmed_at", { withTimezone: true }),
  lastSignInAt: (0, import_pg_core.timestamp)("last_sign_in_at", { withTimezone: true }),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }),
  updatedAt: (0, import_pg_core.timestamp)("updated_at", { withTimezone: true })
});
const realtime = (0, import_pg_core.pgSchema)("realtime");
const realtimeMessages = realtime.table(
  "messages",
  {
    id: (0, import_pg_core.bigserial)({ mode: "bigint" }).primaryKey(),
    topic: (0, import_pg_core.text)().notNull(),
    extension: (0, import_pg_core.text)({
      enum: ["presence", "broadcast", "postgres_changes"]
    }).notNull()
  }
);
const authUid = import_sql.sql`(select auth.uid())`;
const realtimeTopic = import_sql.sql`realtime.topic()`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  anonRole,
  authUid,
  authUsers,
  authenticatedRole,
  postgresRole,
  realtimeMessages,
  realtimeTopic,
  serviceRole,
  supabaseAuthAdminRole
});
//# sourceMappingURL=rls.cjs.map