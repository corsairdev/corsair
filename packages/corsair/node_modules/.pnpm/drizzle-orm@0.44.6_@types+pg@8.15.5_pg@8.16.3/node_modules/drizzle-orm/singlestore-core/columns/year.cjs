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
var year_exports = {};
__export(year_exports, {
  SingleStoreYear: () => SingleStoreYear,
  SingleStoreYearBuilder: () => SingleStoreYearBuilder,
  year: () => year
});
module.exports = __toCommonJS(year_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class SingleStoreYearBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreYearBuilder";
  constructor(name) {
    super(name, "number", "SingleStoreYear");
  }
  /** @internal */
  build(table) {
    return new SingleStoreYear(
      table,
      this.config
    );
  }
}
class SingleStoreYear extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreYear";
  getSQLType() {
    return `year`;
  }
}
function year(name) {
  return new SingleStoreYearBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreYear,
  SingleStoreYearBuilder,
  year
});
//# sourceMappingURL=year.cjs.map