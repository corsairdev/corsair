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
var subquery_exports = {};
__export(subquery_exports, {
  Subquery: () => Subquery,
  WithSubquery: () => WithSubquery
});
module.exports = __toCommonJS(subquery_exports);
var import_entity = require("./entity.cjs");
class Subquery {
  static [import_entity.entityKind] = "Subquery";
  constructor(sql, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
class WithSubquery extends Subquery {
  static [import_entity.entityKind] = "WithSubquery";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Subquery,
  WithSubquery
});
//# sourceMappingURL=subquery.cjs.map