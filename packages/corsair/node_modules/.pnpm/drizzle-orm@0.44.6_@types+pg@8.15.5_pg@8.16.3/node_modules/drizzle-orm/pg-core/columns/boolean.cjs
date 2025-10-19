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
  PgBoolean: () => PgBoolean,
  PgBooleanBuilder: () => PgBooleanBuilder,
  boolean: () => boolean
});
module.exports = __toCommonJS(boolean_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgBooleanBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  /** @internal */
  build(table) {
    return new PgBoolean(table, this.config);
  }
}
class PgBoolean extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBoolean";
  getSQLType() {
    return "boolean";
  }
}
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgBoolean,
  PgBooleanBuilder,
  boolean
});
//# sourceMappingURL=boolean.cjs.map