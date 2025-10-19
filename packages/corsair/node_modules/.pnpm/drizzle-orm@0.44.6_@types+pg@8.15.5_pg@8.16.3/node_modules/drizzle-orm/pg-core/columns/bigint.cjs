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
var bigint_exports = {};
__export(bigint_exports, {
  PgBigInt53: () => PgBigInt53,
  PgBigInt53Builder: () => PgBigInt53Builder,
  PgBigInt64: () => PgBigInt64,
  PgBigInt64Builder: () => PgBigInt64Builder,
  bigint: () => bigint
});
module.exports = __toCommonJS(bigint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
var import_int_common = require("./int.common.cjs");
class PgBigInt53Builder extends import_int_common.PgIntColumnBaseBuilder {
  static [import_entity.entityKind] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number", "PgBigInt53");
  }
  /** @internal */
  build(table) {
    return new PgBigInt53(table, this.config);
  }
}
class PgBigInt53 extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class PgBigInt64Builder extends import_int_common.PgIntColumnBaseBuilder {
  static [import_entity.entityKind] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigInt64");
  }
  /** @internal */
  build(table) {
    return new PgBigInt64(
      table,
      this.config
    );
  }
}
class PgBigInt64 extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigint(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config.mode === "number") {
    return new PgBigInt53Builder(name);
  }
  return new PgBigInt64Builder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgBigInt53,
  PgBigInt53Builder,
  PgBigInt64,
  PgBigInt64Builder,
  bigint
});
//# sourceMappingURL=bigint.cjs.map