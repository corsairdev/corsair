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
var smallint_exports = {};
__export(smallint_exports, {
  GelSmallInt: () => GelSmallInt,
  GelSmallIntBuilder: () => GelSmallIntBuilder,
  smallint: () => smallint
});
module.exports = __toCommonJS(smallint_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_int_common = require("./int.common.cjs");
class GelSmallIntBuilder extends import_int_common.GelIntColumnBaseBuilder {
  static [import_entity.entityKind] = "GelSmallIntBuilder";
  constructor(name) {
    super(name, "number", "GelSmallInt");
  }
  /** @internal */
  build(table) {
    return new GelSmallInt(table, this.config);
  }
}
class GelSmallInt extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelSmallInt";
  getSQLType() {
    return "smallint";
  }
}
function smallint(name) {
  return new GelSmallIntBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelSmallInt,
  GelSmallIntBuilder,
  smallint
});
//# sourceMappingURL=smallint.cjs.map