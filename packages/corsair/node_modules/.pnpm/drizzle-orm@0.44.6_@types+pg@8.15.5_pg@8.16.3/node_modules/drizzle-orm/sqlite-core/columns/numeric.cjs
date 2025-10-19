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
var numeric_exports = {};
__export(numeric_exports, {
  SQLiteNumeric: () => SQLiteNumeric,
  SQLiteNumericBigInt: () => SQLiteNumericBigInt,
  SQLiteNumericBigIntBuilder: () => SQLiteNumericBigIntBuilder,
  SQLiteNumericBuilder: () => SQLiteNumericBuilder,
  SQLiteNumericNumber: () => SQLiteNumericNumber,
  SQLiteNumericNumberBuilder: () => SQLiteNumericNumberBuilder,
  numeric: () => numeric
});
module.exports = __toCommonJS(numeric_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SQLiteNumericBuilder extends import_common.SQLiteColumnBuilder {
  static [import_entity.entityKind] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumeric(
      table,
      this.config
    );
  }
}
class SQLiteNumeric extends import_common.SQLiteColumn {
  static [import_entity.entityKind] = "SQLiteNumeric";
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return String(value);
  }
  getSQLType() {
    return "numeric";
  }
}
class SQLiteNumericNumberBuilder extends import_common.SQLiteColumnBuilder {
  static [import_entity.entityKind] = "SQLiteNumericNumberBuilder";
  constructor(name) {
    super(name, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumericNumber(
      table,
      this.config
    );
  }
}
class SQLiteNumericNumber extends import_common.SQLiteColumn {
  static [import_entity.entityKind] = "SQLiteNumericNumber";
  mapFromDriverValue(value) {
    if (typeof value === "number") return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}
class SQLiteNumericBigIntBuilder extends import_common.SQLiteColumnBuilder {
  static [import_entity.entityKind] = "SQLiteNumericBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumericBigInt(
      table,
      this.config
    );
  }
}
class SQLiteNumericBigInt extends import_common.SQLiteColumn {
  static [import_entity.entityKind] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}
function numeric(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQLiteNumeric,
  SQLiteNumericBigInt,
  SQLiteNumericBigIntBuilder,
  SQLiteNumericBuilder,
  SQLiteNumericNumber,
  SQLiteNumericNumberBuilder,
  numeric
});
//# sourceMappingURL=numeric.cjs.map