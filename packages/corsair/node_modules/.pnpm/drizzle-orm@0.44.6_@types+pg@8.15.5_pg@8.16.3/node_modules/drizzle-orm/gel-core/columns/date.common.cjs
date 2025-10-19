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
var date_common_exports = {};
__export(date_common_exports, {
  GelLocalDateColumnBaseBuilder: () => GelLocalDateColumnBaseBuilder
});
module.exports = __toCommonJS(date_common_exports);
var import_entity = require("../../entity.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_common = require("./common.cjs");
class GelLocalDateColumnBaseBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelLocalDateColumnBaseBuilder";
  defaultNow() {
    return this.default(import_sql.sql`now()`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelLocalDateColumnBaseBuilder
});
//# sourceMappingURL=date.common.cjs.map