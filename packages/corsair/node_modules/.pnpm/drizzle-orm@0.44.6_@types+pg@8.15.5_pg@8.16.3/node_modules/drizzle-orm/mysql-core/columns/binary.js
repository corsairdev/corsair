import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlBinaryBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlBinaryBuilder";
  constructor(name, length) {
    super(name, "string", "MySqlBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new MySqlBinary(table, this.config);
  }
}
class MySqlBinary extends MySqlColumn {
  static [entityKind] = "MySqlBinary";
  length = this.config.length;
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    if (Buffer.isBuffer(value)) return value.toString();
    const str = [];
    for (const v of value) {
      str.push(v === 49 ? "1" : "0");
    }
    return str.join("");
  }
  getSQLType() {
    return this.length === void 0 ? `binary` : `binary(${this.length})`;
  }
}
function binary(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlBinaryBuilder(name, config.length);
}
export {
  MySqlBinary,
  MySqlBinaryBuilder,
  binary
};
//# sourceMappingURL=binary.js.map