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
  anonymousRole: () => anonymousRole,
  authUid: () => authUid,
  authenticatedRole: () => authenticatedRole,
  crudPolicy: () => crudPolicy
});
module.exports = __toCommonJS(rls_exports);
var import_entity = require("../entity.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_roles = require("../pg-core/roles.cjs");
var import_sql = require("../sql/sql.cjs");
const crudPolicy = (options) => {
  if (options.read === void 0) {
    throw new Error("crudPolicy requires a read policy");
  }
  if (options.modify === void 0) {
    throw new Error("crudPolicy requires a modify policy");
  }
  let read;
  if (options.read === true) {
    read = import_sql.sql`true`;
  } else if (options.read === false) {
    read = import_sql.sql`false`;
  } else if (options.read !== null) {
    read = options.read;
  }
  let modify;
  if (options.modify === true) {
    modify = import_sql.sql`true`;
  } else if (options.modify === false) {
    modify = import_sql.sql`false`;
  } else if (options.modify !== null) {
    modify = options.modify;
  }
  let rolesName = "";
  if (Array.isArray(options.role)) {
    rolesName = options.role.map((it) => {
      return (0, import_entity.is)(it, import_roles.PgRole) ? it.name : it;
    }).join("-");
  } else {
    rolesName = (0, import_entity.is)(options.role, import_roles.PgRole) ? options.role.name : options.role;
  }
  return [
    read && (0, import_pg_core.pgPolicy)(`crud-${rolesName}-policy-select`, {
      for: "select",
      to: options.role,
      using: read
    }),
    modify && (0, import_pg_core.pgPolicy)(`crud-${rolesName}-policy-insert`, {
      for: "insert",
      to: options.role,
      withCheck: modify
    }),
    modify && (0, import_pg_core.pgPolicy)(`crud-${rolesName}-policy-update`, {
      for: "update",
      to: options.role,
      using: modify,
      withCheck: modify
    }),
    modify && (0, import_pg_core.pgPolicy)(`crud-${rolesName}-policy-delete`, {
      for: "delete",
      to: options.role,
      using: modify
    })
  ].filter(Boolean);
};
const authenticatedRole = (0, import_roles.pgRole)("authenticated").existing();
const anonymousRole = (0, import_roles.pgRole)("anonymous").existing();
const authUid = (userIdColumn) => import_sql.sql`(select auth.user_id() = ${userIdColumn})`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  anonymousRole,
  authUid,
  authenticatedRole,
  crudPolicy
});
//# sourceMappingURL=rls.cjs.map