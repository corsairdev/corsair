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
  MySqlDecimal: () => MySqlDecimal,
  MySqlDecimalBigInt: () => MySqlDecimalBigInt,
  MySqlDecimalBigIntBuilder: () => MySqlDecimalBigIntBuilder,
  MySqlDecimalBuilder: () => MySqlDecimalBuilder,
  MySqlDecimalNumber: () => MySqlDecimalNumber,
  MySqlDecimalNumberBuilder: () => MySqlDecimalNumberBuilder,
  decimal: () => decimal
});
module.exports = __toCommonJS(decimal_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlDecimalBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimalBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlDecimal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDecimal(
      table,
      this.config
    );
  }
}
class MySqlDecimal extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimal";
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
class MySqlDecimalNumberBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimalNumberBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlDecimalNumber");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDecimalNumber(
      table,
      this.config
    );
  }
}
class MySqlDecimalNumber extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimalNumber";
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
class MySqlDecimalBigIntBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimalBigIntBuilder";
  constructor(name, config) {
    super(name, "bigint", "MySqlDecimalBigInt");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDecimalBigInt(
      table,
      this.config
    );
  }
}
class MySqlDecimalBigInt extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDecimalBigInt";
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
  return mode === "number" ? new MySqlDecimalNumberBuilder(name, config) : mode === "bigint" ? new MySqlDecimalBigIntBuilder(name, config) : new MySqlDecimalBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlDecimal,
  MySqlDecimalBigInt,
  MySqlDecimalBigIntBuilder,
  MySqlDecimalBuilder,
  MySqlDecimalNumber,
  MySqlDecimalNumberBuilder,
  decimal
});
//# sourceMappingURL=decimal.cjs.map