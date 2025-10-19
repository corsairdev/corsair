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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var expressions_exports = {};
__export(expressions_exports, {
  concat: () => concat,
  dotProduct: () => dotProduct,
  euclideanDistance: () => euclideanDistance,
  substring: () => substring
});
module.exports = __toCommonJS(expressions_exports);
var import_expressions = require("../sql/expressions/index.cjs");
var import_sql = require("../sql/sql.cjs");
__reExport(expressions_exports, require("../sql/expressions/index.cjs"), module.exports);
function concat(column, value) {
  return import_sql.sql`${column} || ${(0, import_expressions.bindIfParam)(value, column)}`;
}
function substring(column, { from, for: _for }) {
  const chunks = [import_sql.sql`substring(`, column];
  if (from !== void 0) {
    chunks.push(import_sql.sql` from `, (0, import_expressions.bindIfParam)(from, column));
  }
  if (_for !== void 0) {
    chunks.push(import_sql.sql` for `, (0, import_expressions.bindIfParam)(_for, column));
  }
  chunks.push(import_sql.sql`)`);
  return import_sql.sql.join(chunks);
}
function dotProduct(column, value) {
  return import_sql.sql`${column} <*> ${JSON.stringify(value)}`;
}
function euclideanDistance(column, value) {
  return import_sql.sql`${column} <-> ${JSON.stringify(value)}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  concat,
  dotProduct,
  euclideanDistance,
  substring,
  ...require("../sql/expressions/index.cjs")
});
//# sourceMappingURL=expressions.cjs.map