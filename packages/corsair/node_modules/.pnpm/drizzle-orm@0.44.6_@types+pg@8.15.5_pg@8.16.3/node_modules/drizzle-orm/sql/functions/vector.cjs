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
var vector_exports = {};
__export(vector_exports, {
  cosineDistance: () => cosineDistance,
  hammingDistance: () => hammingDistance,
  innerProduct: () => innerProduct,
  jaccardDistance: () => jaccardDistance,
  l1Distance: () => l1Distance,
  l2Distance: () => l2Distance
});
module.exports = __toCommonJS(vector_exports);
var import_sql = require("../sql.cjs");
function toSql(value) {
  return JSON.stringify(value);
}
function l2Distance(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <-> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <-> ${value}`;
}
function l1Distance(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <+> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <+> ${value}`;
}
function innerProduct(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <#> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <#> ${value}`;
}
function cosineDistance(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <=> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <=> ${value}`;
}
function hammingDistance(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <~> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <~> ${value}`;
}
function jaccardDistance(column, value) {
  if (Array.isArray(value)) {
    return import_sql.sql`${column} <%> ${toSql(value)}`;
  }
  return import_sql.sql`${column} <%> ${value}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cosineDistance,
  hammingDistance,
  innerProduct,
  jaccardDistance,
  l1Distance,
  l2Distance
});
//# sourceMappingURL=vector.cjs.map