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
var custom_exports = {};
__export(custom_exports, {
  SingleStoreCustomColumn: () => SingleStoreCustomColumn,
  SingleStoreCustomColumnBuilder: () => SingleStoreCustomColumnBuilder,
  customType: () => customType
});
module.exports = __toCommonJS(custom_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreCustomColumnBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SingleStoreCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new SingleStoreCustomColumn(
      table,
      this.config
    );
  }
}
class SingleStoreCustomColumn extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
}
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
    return new SingleStoreCustomColumnBuilder(name, config, customTypeParams);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreCustomColumn,
  SingleStoreCustomColumnBuilder,
  customType
});
//# sourceMappingURL=custom.cjs.map