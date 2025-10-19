"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var select_exports = {};
__export(select_exports, {
  asc: () => asc,
  desc: () => desc
});
module.exports = __toCommonJS(select_exports);
var import_sql = require("../sql.cjs");
function asc(column) {
  return import_sql.sql`${column} asc`;
}
function desc(column) {
  return import_sql.sql`${column} desc`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asc,
  desc
});
//# sourceMappingURL=select.cjs.map