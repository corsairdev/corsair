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
  SingleStoreMediumInt: () => SingleStoreMediumInt,
  SingleStoreMediumIntBuilder: () => SingleStoreMediumIntBuilder,
  mediumint: () => mediumint
});
module.exports = __toCommonJS(mediumint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreMediumIntBuilder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreMediumIntBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreMediumInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new SingleStoreMediumInt(
      table,
      this.config
    );
  }
}
class SingleStoreMediumInt extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreMediumInt";
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
  return new SingleStoreMediumIntBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreMediumInt,
  SingleStoreMediumIntBuilder,
  mediumint
});
//# sourceMappingURL=mediumint.cjs.map