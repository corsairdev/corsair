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
var timestamptz_exports = {};
__export(timestamptz_exports, {
  GelTimestampTz: () => GelTimestampTz,
  GelTimestampTzBuilder: () => GelTimestampTzBuilder,
  timestamptz: () => timestamptz
});
module.exports = __toCommonJS(timestamptz_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_date_common = require("./date.common.cjs");
class GelTimestampTzBuilder extends import_date_common.GelLocalDateColumnBaseBuilder {
  static [import_entity.entityKind] = "GelTimestampTzBuilder";
  constructor(name) {
    super(name, "date", "GelTimestampTz");
  }
  /** @internal */
  build(table) {
    return new GelTimestampTz(
      table,
      this.config
    );
  }
}
class GelTimestampTz extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelTimestampTz";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "datetime";
  }
}
function timestamptz(name) {
  return new GelTimestampTzBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelTimestampTz,
  GelTimestampTzBuilder,
  timestamptz
});
//# sourceMappingURL=timestamptz.cjs.map