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
var neon_auth_exports = {};
__export(neon_auth_exports, {
  usersSync: () => usersSync
});
module.exports = __toCommonJS(neon_auth_exports);
var import_pg_core = require("../pg-core/index.cjs");
const neonAuthSchema = (0, import_pg_core.pgSchema)("neon_auth");
const usersSync = neonAuthSchema.table("users_sync", {
  rawJson: (0, import_pg_core.jsonb)("raw_json").notNull(),
  id: (0, import_pg_core.text)().primaryKey().notNull(),
  name: (0, import_pg_core.text)(),
  email: (0, import_pg_core.text)(),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true, mode: "string" }),
  deletedAt: (0, import_pg_core.timestamp)("deleted_at", { withTimezone: true, mode: "string" }),
  updatedAt: (0, import_pg_core.timestamp)("updated_at", { withTimezone: true, mode: "string" })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersSync
});
//# sourceMappingURL=neon-auth.cjs.map