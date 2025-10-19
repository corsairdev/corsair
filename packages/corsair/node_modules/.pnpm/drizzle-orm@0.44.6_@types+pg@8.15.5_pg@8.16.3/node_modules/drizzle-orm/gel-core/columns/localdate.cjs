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
var localdate_exports = {};
__export(localdate_exports, {
  GelLocalDateString: () => GelLocalDateString,
  GelLocalDateStringBuilder: () => GelLocalDateStringBuilder,
  localDate: () => localDate
});
module.exports = __toCommonJS(localdate_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_date_common = require("./date.common.cjs");
class GelLocalDateStringBuilder extends import_date_common.GelLocalDateColumnBaseBuilder {
  static [import_entity.entityKind] = "GelLocalDateStringBuilder";
  constructor(name) {
    super(name, "localDate", "GelLocalDateString");
  }
  /** @internal */
  build(table) {
    return new GelLocalDateString(
      table,
      this.config
    );
  }
}
class GelLocalDateString extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelLocalDateString";
  getSQLType() {
    return "cal::local_date";
  }
}
function localDate(name) {
  return new GelLocalDateStringBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelLocalDateString,
  GelLocalDateStringBuilder,
  localDate
});
//# sourceMappingURL=localdate.cjs.map