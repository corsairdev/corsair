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
var localtime_exports = {};
__export(localtime_exports, {
  GelLocalTime: () => GelLocalTime,
  GelLocalTimeBuilder: () => GelLocalTimeBuilder,
  localTime: () => localTime
});
module.exports = __toCommonJS(localtime_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_date_common = require("./date.common.cjs");
class GelLocalTimeBuilder extends import_date_common.GelLocalDateColumnBaseBuilder {
  static [import_entity.entityKind] = "GelLocalTimeBuilder";
  constructor(name) {
    super(name, "localTime", "GelLocalTime");
  }
  /** @internal */
  build(table) {
    return new GelLocalTime(
      table,
      this.config
    );
  }
}
class GelLocalTime extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelLocalTime";
  getSQLType() {
    return "cal::local_time";
  }
}
function localTime(name) {
  return new GelLocalTimeBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelLocalTime,
  GelLocalTimeBuilder,
  localTime
});
//# sourceMappingURL=localtime.cjs.map