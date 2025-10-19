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
var decimal_exports = {};
__export(decimal_exports, {
  SingleStoreDecimal: () => SingleStoreDecimal,
  SingleStoreDecimalBigInt: () => SingleStoreDecimalBigInt,
  SingleStoreDecimalBigIntBuilder: () => SingleStoreDecimalBigIntBuilder,
  SingleStoreDecimalBuilder: () => SingleStoreDecimalBuilder,
  SingleStoreDecimalNumber: () => SingleStoreDecimalNumber,
  SingleStoreDecimalNumberBuilder: () => SingleStoreDecimalNumberBuilder,
  decimal: () => decimal
});
module.exports = __toCommonJS(decimal_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreDecimalBuilder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimalBuilder";
  constructor(name, config) {
    super(name, "string", "SingleStoreDecimal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreDecimal(
      table,
      this.config
    );
  }
}
class SingleStoreDecimal extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimal";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return String(value);
  }
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "decimal";
    } else {
      type += `decimal(${this.precision})`;
    }
    type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
    return this.unsigned ? `${type} unsigned` : type;
  }
}
class SingleStoreDecimalNumberBuilder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimalNumberBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreDecimalNumber");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreDecimalNumber(
      table,
      this.config
    );
  }
}
class SingleStoreDecimalNumber extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimalNumber";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  mapFromDriverValue(value) {
    if (typeof value === "number") return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "decimal";
    } else {
      type += `decimal(${this.precision})`;
    }
    type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
    return this.unsigned ? `${type} unsigned` : type;
  }
}
class SingleStoreDecimalBigIntBuilder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimalBigIntBuilder";
  constructor(name, config) {
    super(name, "bigint", "SingleStoreDecimalBigInt");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreDecimalBigInt(
      table,
      this.config
    );
  }
}
class SingleStoreDecimalBigInt extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreDecimalBigInt";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "decimal";
    } else {
      type += `decimal(${this.precision})`;
    }
    type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function decimal(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SingleStoreDecimalNumberBuilder(name, config) : mode === "bigint" ? new SingleStoreDecimalBigIntBuilder(name, config) : new SingleStoreDecimalBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreDecimal,
  SingleStoreDecimalBigInt,
  SingleStoreDecimalBigIntBuilder,
  SingleStoreDecimalBuilder,
  SingleStoreDecimalNumber,
  SingleStoreDecimalNumberBuilder,
  decimal
});
//# sourceMappingURL=decimal.cjs.map