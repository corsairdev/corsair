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
var aggregate_exports = {};
__export(aggregate_exports, {
  avg: () => avg,
  avgDistinct: () => avgDistinct,
  count: () => count,
  countDistinct: () => countDistinct,
  max: () => max,
  min: () => min,
  sum: () => sum,
  sumDistinct: () => sumDistinct
});
module.exports = __toCommonJS(aggregate_exports);
var import_column = require("../../column.cjs");
var import_entity = require("../../entity.cjs");
var import_sql = require("../sql.cjs");
function count(expression) {
  return import_sql.sql`count(${expression || import_sql.sql.raw("*")})`.mapWith(Number);
}
function countDistinct(expression) {
  return import_sql.sql`count(distinct ${expression})`.mapWith(Number);
}
function avg(expression) {
  return import_sql.sql`avg(${expression})`.mapWith(String);
}
function avgDistinct(expression) {
  return import_sql.sql`avg(distinct ${expression})`.mapWith(String);
}
function sum(expression) {
  return import_sql.sql`sum(${expression})`.mapWith(String);
}
function sumDistinct(expression) {
  return import_sql.sql`sum(distinct ${expression})`.mapWith(String);
}
function max(expression) {
  return import_sql.sql`max(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
}
function min(expression) {
  return import_sql.sql`min(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  avg,
  avgDistinct,
  count,
  countDistinct,
  max,
  min,
  sum,
  sumDistinct
});
//# sourceMappingURL=aggregate.cjs.map