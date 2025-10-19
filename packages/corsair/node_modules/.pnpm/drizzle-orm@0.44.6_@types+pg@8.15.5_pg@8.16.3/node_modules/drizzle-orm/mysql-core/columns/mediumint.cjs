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
var mediumint_exports = {};
__export(mediumint_exports, {
  MySqlMediumInt: () => MySqlMediumInt,
  MySqlMediumIntBuilder: () => MySqlMediumIntBuilder,
  mediumint: () => mediumint
});
module.exports = __toCommonJS(mediumint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlMediumIntBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlMediumIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlMediumInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlMediumInt(
      table,
      this.config
    );
  }
}
class MySqlMediumInt extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlMediumInt";
  getSQLType() {
    return `mediumint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function mediumint(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlMediumIntBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlMediumInt,
  MySqlMediumIntBuilder,
  mediumint
});
//# sourceMappingURL=mediumint.cjs.map