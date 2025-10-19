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
  SingleStoreBigInt53: () => SingleStoreBigInt53,
  SingleStoreBigInt53Builder: () => SingleStoreBigInt53Builder,
  SingleStoreBigInt64: () => SingleStoreBigInt64,
  SingleStoreBigInt64Builder: () => SingleStoreBigInt64Builder,
  bigint: () => bigint
});
module.exports = __toCommonJS(bigint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreBigInt53Builder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreBigInt53Builder";
  constructor(name, unsigned = false) {
    super(name, "number", "SingleStoreBigInt53");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreBigInt53(
      table,
      this.config
    );
  }
}
class SingleStoreBigInt53 extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreBigInt53";
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
class SingleStoreBigInt64Builder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreBigInt64Builder";
  constructor(name, unsigned = false) {
    super(name, "bigint", "SingleStoreBigInt64");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreBigInt64(
      table,
      this.config
    );
  }
}
class SingleStoreBigInt64 extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreBigInt64";
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
    return new SingleStoreBigInt53Builder(name, config.unsigned);
  }
  return new SingleStoreBigInt64Builder(name, config.unsigned);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreBigInt53,
  SingleStoreBigInt53Builder,
  SingleStoreBigInt64,
  SingleStoreBigInt64Builder,
  bigint
});
//# sourceMappingURL=bigint.cjs.map