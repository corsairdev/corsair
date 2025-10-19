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
var boolean_exports = {};
__export(boolean_exports, {
  GelBoolean: () => GelBoolean,
  GelBooleanBuilder: () => GelBooleanBuilder,
  boolean: () => boolean
});
module.exports = __toCommonJS(boolean_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelBooleanBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "GelBoolean");
  }
  /** @internal */
  build(table) {
    return new GelBoolean(table, this.config);
  }
}
class GelBoolean extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelBoolean";
  getSQLType() {
    return "boolean";
  }
}
function boolean(name) {
  return new GelBooleanBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelBoolean,
  GelBooleanBuilder,
  boolean
});
//# sourceMappingURL=boolean.cjs.map