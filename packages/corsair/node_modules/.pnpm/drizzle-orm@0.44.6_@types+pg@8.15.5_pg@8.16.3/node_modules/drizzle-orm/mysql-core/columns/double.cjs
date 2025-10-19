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
var double_exports = {};
__export(double_exports, {
  MySqlDouble: () => MySqlDouble,
  MySqlDoubleBuilder: () => MySqlDoubleBuilder,
  double: () => double
});
module.exports = __toCommonJS(double_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlDoubleBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDoubleBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlDouble");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDouble(table, this.config);
  }
}
class MySqlDouble extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlDouble";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `double(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "double";
    } else {
      type += `double(${this.precision})`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function double(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlDoubleBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlDouble,
  MySqlDoubleBuilder,
  double
});
//# sourceMappingURL=double.cjs.map