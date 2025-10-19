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
  MySqlBoolean: () => MySqlBoolean,
  MySqlBooleanBuilder: () => MySqlBooleanBuilder,
  boolean: () => boolean
});
module.exports = __toCommonJS(boolean_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class MySqlBooleanBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "MySqlBoolean");
  }
  /** @internal */
  build(table) {
    return new MySqlBoolean(
      table,
      this.config
    );
  }
}
class MySqlBoolean extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
}
function boolean(name) {
  return new MySqlBooleanBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlBoolean,
  MySqlBooleanBuilder,
  boolean
});
//# sourceMappingURL=boolean.cjs.map