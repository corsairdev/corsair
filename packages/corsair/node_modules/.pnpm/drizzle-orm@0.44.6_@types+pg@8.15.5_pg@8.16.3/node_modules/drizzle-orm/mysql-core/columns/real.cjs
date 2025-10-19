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
var real_exports = {};
__export(real_exports, {
  MySqlReal: () => MySqlReal,
  MySqlRealBuilder: () => MySqlRealBuilder,
  real: () => real
});
module.exports = __toCommonJS(real_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlRealBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlRealBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlReal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
  }
  /** @internal */
  build(table) {
    return new MySqlReal(table, this.config);
  }
}
class MySqlReal extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlReal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `real(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "real";
    } else {
      return `real(${this.precision})`;
    }
  }
}
function real(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlRealBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlReal,
  MySqlRealBuilder,
  real
});
//# sourceMappingURL=real.cjs.map