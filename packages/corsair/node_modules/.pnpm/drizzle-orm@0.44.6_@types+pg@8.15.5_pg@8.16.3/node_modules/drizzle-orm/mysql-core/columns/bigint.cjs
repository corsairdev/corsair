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
  MySqlBigInt53: () => MySqlBigInt53,
  MySqlBigInt53Builder: () => MySqlBigInt53Builder,
  MySqlBigInt64: () => MySqlBigInt64,
  MySqlBigInt64Builder: () => MySqlBigInt64Builder,
  bigint: () => bigint
});
module.exports = __toCommonJS(bigint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlBigInt53Builder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlBigInt53Builder";
  constructor(name, unsigned = false) {
    super(name, "number", "MySqlBigInt53");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt53(
      table,
      this.config
    );
  }
}
class MySqlBigInt53 extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlBigInt53";
  getSQLType() {
    return `bigint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class MySqlBigInt64Builder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlBigInt64Builder";
  constructor(name, unsigned = false) {
    super(name, "bigint", "MySqlBigInt64");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt64(
      table,
      this.config
    );
  }
}
class MySqlBigInt64 extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlBigInt64";
  getSQLType() {
    return `bigint${this.config.unsigned ? " unsigned" : ""}`;
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigint(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config.mode === "number") {
    return new MySqlBigInt53Builder(name, config.unsigned);
  }
  return new MySqlBigInt64Builder(name, config.unsigned);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlBigInt53,
  MySqlBigInt53Builder,
  MySqlBigInt64,
  MySqlBigInt64Builder,
  bigint
});
//# sourceMappingURL=bigint.cjs.map