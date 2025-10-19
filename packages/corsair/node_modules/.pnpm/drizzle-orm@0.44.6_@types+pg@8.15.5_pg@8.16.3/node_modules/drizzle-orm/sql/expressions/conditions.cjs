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
var conditions_exports = {};
__export(conditions_exports, {
  and: () => and,
  arrayContained: () => arrayContained,
  arrayContains: () => arrayContains,
  arrayOverlaps: () => arrayOverlaps,
  between: () => between,
  bindIfParam: () => bindIfParam,
  eq: () => eq,
  exists: () => exists,
  gt: () => gt,
  gte: () => gte,
  ilike: () => ilike,
  inArray: () => inArray,
  isNotNull: () => isNotNull,
  isNull: () => isNull,
  like: () => like,
  lt: () => lt,
  lte: () => lte,
  ne: () => ne,
  not: () => not,
  notBetween: () => notBetween,
  notExists: () => notExists,
  notIlike: () => notIlike,
  notInArray: () => notInArray,
  notLike: () => notLike,
  or: () => or
});
module.exports = __toCommonJS(conditions_exports);
var import_column = require("../../column.cjs");
var import_entity = require("../../entity.cjs");
var import_table = require("../../table.cjs");
var import_sql = require("../sql.cjs");
function bindIfParam(value, column) {
  if ((0, import_sql.isDriverValueEncoder)(column) && !(0, import_sql.isSQLWrapper)(value) && !(0, import_entity.is)(value, import_sql.Param) && !(0, import_entity.is)(value, import_sql.Placeholder) && !(0, import_entity.is)(value, import_column.Column) && !(0, import_entity.is)(value, import_table.Table) && !(0, import_entity.is)(value, import_sql.View)) {
    return new import_sql.Param(value, column);
  }
  return value;
}
const eq = (left, right) => {
  return import_sql.sql`${left} = ${bindIfParam(right, left)}`;
};
const ne = (left, right) => {
  return import_sql.sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new import_sql.SQL(conditions);
  }
  return new import_sql.SQL([
    new import_sql.StringChunk("("),
    import_sql.sql.join(conditions, new import_sql.StringChunk(" and ")),
    new import_sql.StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new import_sql.SQL(conditions);
  }
  return new import_sql.SQL([
    new import_sql.StringChunk("("),
    import_sql.sql.join(conditions, new import_sql.StringChunk(" or ")),
    new import_sql.StringChunk(")")
  ]);
}
function not(condition) {
  return import_sql.sql`not ${condition}`;
}
const gt = (left, right) => {
  return import_sql.sql`${left} > ${bindIfParam(right, left)}`;
};
const gte = (left, right) => {
  return import_sql.sql`${left} >= ${bindIfParam(right, left)}`;
};
const lt = (left, right) => {
  return import_sql.sql`${left} < ${bindIfParam(right, left)}`;
};
const lte = (left, right) => {
  return import_sql.sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return import_sql.sql`false`;
    }
    return import_sql.sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return import_sql.sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return import_sql.sql`true`;
    }
    return import_sql.sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return import_sql.sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return import_sql.sql`${value} is null`;
}
function isNotNull(value) {
  return import_sql.sql`${value} is not null`;
}
function exists(subquery) {
  return import_sql.sql`exists ${subquery}`;
}
function notExists(subquery) {
  return import_sql.sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return import_sql.sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return import_sql.sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return import_sql.sql`${column} like ${value}`;
}
function notLike(column, value) {
  return import_sql.sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return import_sql.sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return import_sql.sql`${column} not ilike ${value}`;
}
function arrayContains(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("arrayContains requires at least one value");
    }
    const array = import_sql.sql`${bindIfParam(values, column)}`;
    return import_sql.sql`${column} @> ${array}`;
  }
  return import_sql.sql`${column} @> ${bindIfParam(values, column)}`;
}
function arrayContained(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("arrayContained requires at least one value");
    }
    const array = import_sql.sql`${bindIfParam(values, column)}`;
    return import_sql.sql`${column} <@ ${array}`;
  }
  return import_sql.sql`${column} <@ ${bindIfParam(values, column)}`;
}
function arrayOverlaps(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("arrayOverlaps requires at least one value");
    }
    const array = import_sql.sql`${bindIfParam(values, column)}`;
    return import_sql.sql`${column} && ${array}`;
  }
  return import_sql.sql`${column} && ${bindIfParam(values, column)}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  and,
  arrayContained,
  arrayContains,
  arrayOverlaps,
  between,
  bindIfParam,
  eq,
  exists,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notExists,
  notIlike,
  notInArray,
  notLike,
  or
});
//# sourceMappingURL=conditions.cjs.map