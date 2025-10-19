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
  MySqlYear: () => MySqlYear,
  MySqlYearBuilder: () => MySqlYearBuilder,
  year: () => year
});
module.exports = __toCommonJS(year_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class MySqlYearBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlYearBuilder";
  constructor(name) {
    super(name, "number", "MySqlYear");
  }
  /** @internal */
  build(table) {
    return new MySqlYear(table, this.config);
  }
}
class MySqlYear extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlYear";
  getSQLType() {
    return `year`;
  }
}
function year(name) {
  return new MySqlYearBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlYear,
  MySqlYearBuilder,
  year
});
//# sourceMappingURL=year.cjs.map