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
var timestamp_exports = {};
__export(timestamp_exports, {
  SingleStoreTimestamp: () => SingleStoreTimestamp,
  SingleStoreTimestampBuilder: () => SingleStoreTimestampBuilder,
  SingleStoreTimestampString: () => SingleStoreTimestampString,
  SingleStoreTimestampStringBuilder: () => SingleStoreTimestampStringBuilder,
  timestamp: () => timestamp
});
module.exports = __toCommonJS(timestamp_exports);
var import_entity = require("../../entity.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_utils = require("../../utils.cjs");
var import_date_common = require("./date.common.cjs");
class SingleStoreTimestampBuilder extends import_date_common.SingleStoreDateColumnBaseBuilder {
  static [import_entity.entityKind] = "SingleStoreTimestampBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreTimestamp");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTimestamp(
      table,
      this.config
    );
  }
  defaultNow() {
    return this.default(import_sql.sql`CURRENT_TIMESTAMP`);
  }
}
class SingleStoreTimestamp extends import_date_common.SingleStoreDateBaseColumn {
  static [import_entity.entityKind] = "SingleStoreTimestamp";
  getSQLType() {
    return `timestamp`;
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, -1).replace("T", " ");
  }
}
class SingleStoreTimestampStringBuilder extends import_date_common.SingleStoreDateColumnBaseBuilder {
  static [import_entity.entityKind] = "SingleStoreTimestampStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreTimestampString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTimestampString(
      table,
      this.config
    );
  }
  defaultNow() {
    return this.default(import_sql.sql`CURRENT_TIMESTAMP`);
  }
}
class SingleStoreTimestampString extends import_date_common.SingleStoreDateBaseColumn {
  static [import_entity.entityKind] = "SingleStoreTimestampString";
  getSQLType() {
    return `timestamp`;
  }
}
function timestamp(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "string") {
    return new SingleStoreTimestampStringBuilder(name);
  }
  return new SingleStoreTimestampBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreTimestamp,
  SingleStoreTimestampBuilder,
  SingleStoreTimestampString,
  SingleStoreTimestampStringBuilder,
  timestamp
});
//# sourceMappingURL=timestamp.cjs.map