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
var uuid_exports = {};
__export(uuid_exports, {
  PgUUID: () => PgUUID,
  PgUUIDBuilder: () => PgUUIDBuilder,
  uuid: () => uuid
});
module.exports = __toCommonJS(uuid_exports);
var import_entity = require("../../entity.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_common = require("./common.cjs");
class PgUUIDBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default(import_sql.sql`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
}
class PgUUID extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
}
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgUUID,
  PgUUIDBuilder,
  uuid
});
//# sourceMappingURL=uuid.cjs.map