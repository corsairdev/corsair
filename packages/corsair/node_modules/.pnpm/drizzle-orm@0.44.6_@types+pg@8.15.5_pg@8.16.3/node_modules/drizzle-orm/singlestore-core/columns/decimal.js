import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreDecimalBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalBuilder";
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
class SingleStoreDecimal extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimal";
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
class SingleStoreDecimalNumberBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalNumberBuilder";
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
class SingleStoreDecimalNumber extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalNumber";
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
class SingleStoreDecimalBigIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalBigIntBuilder";
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
class SingleStoreDecimalBigInt extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalBigInt";
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
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SingleStoreDecimalNumberBuilder(name, config) : mode === "bigint" ? new SingleStoreDecimalBigIntBuilder(name, config) : new SingleStoreDecimalBuilder(name, config);
}
export {
  SingleStoreDecimal,
  SingleStoreDecimalBigInt,
  SingleStoreDecimalBigIntBuilder,
  SingleStoreDecimalBuilder,
  SingleStoreDecimalNumber,
  SingleStoreDecimalNumberBuilder,
  decimal
};
//# sourceMappingURL=decimal.js.map