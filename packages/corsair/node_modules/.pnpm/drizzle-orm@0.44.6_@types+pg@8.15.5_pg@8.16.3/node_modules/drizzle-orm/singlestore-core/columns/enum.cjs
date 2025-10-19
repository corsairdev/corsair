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
var enum_exports = {};
__export(enum_exports, {
  SingleStoreEnumColumn: () => SingleStoreEnumColumn,
  SingleStoreEnumColumnBuilder: () => SingleStoreEnumColumnBuilder,
  singlestoreEnum: () => singlestoreEnum
});
module.exports = __toCommonJS(enum_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreEnumColumnBuilder extends import_common.SingleStoreColumnBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generatedAlwaysAs(as, config) {
    throw new Error("Method not implemented.");
  }
  static [import_entity.entityKind] = "SingleStoreEnumColumnBuilder";
  constructor(name, values) {
    super(name, "string", "SingleStoreEnumColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new SingleStoreEnumColumn(
      table,
      this.config
    );
  }
}
class SingleStoreEnumColumn extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
function singlestoreEnum(a, b) {
  const { name, config: values } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (values.length === 0) {
    throw new Error(`You have an empty array for "${name}" enum values`);
  }
  return new SingleStoreEnumColumnBuilder(name, values);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreEnumColumn,
  SingleStoreEnumColumnBuilder,
  singlestoreEnum
});
//# sourceMappingURL=enum.cjs.map