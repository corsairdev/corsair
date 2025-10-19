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
  GelTimestamp: () => GelTimestamp,
  GelTimestampBuilder: () => GelTimestampBuilder,
  timestamp: () => timestamp
});
module.exports = __toCommonJS(timestamp_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_date_common = require("./date.common.cjs");
class GelTimestampBuilder extends import_date_common.GelLocalDateColumnBaseBuilder {
  static [import_entity.entityKind] = "GelTimestampBuilder";
  constructor(name) {
    super(name, "localDateTime", "GelTimestamp");
  }
  /** @internal */
  build(table) {
    return new GelTimestamp(
      table,
      this.config
    );
  }
}
class GelTimestamp extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelTimestamp";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "cal::local_datetime";
  }
}
function timestamp(name) {
  return new GelTimestampBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelTimestamp,
  GelTimestampBuilder,
  timestamp
});
//# sourceMappingURL=timestamp.cjs.map