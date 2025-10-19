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
var decimal_exports = {};
__export(decimal_exports, {
  GelDecimal: () => GelDecimal,
  GelDecimalBuilder: () => GelDecimalBuilder,
  decimal: () => decimal
});
module.exports = __toCommonJS(decimal_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelDecimalBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelDecimalBuilder";
  constructor(name) {
    super(name, "string", "GelDecimal");
  }
  /** @internal */
  build(table) {
    return new GelDecimal(table, this.config);
  }
}
class GelDecimal extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelDecimal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "numeric";
  }
}
function decimal(name) {
  return new GelDecimalBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelDecimal,
  GelDecimalBuilder,
  decimal
});
//# sourceMappingURL=decimal.cjs.map