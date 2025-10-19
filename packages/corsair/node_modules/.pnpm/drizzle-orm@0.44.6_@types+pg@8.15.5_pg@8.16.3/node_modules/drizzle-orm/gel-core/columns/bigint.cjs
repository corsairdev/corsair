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
var bigint_exports = {};
__export(bigint_exports, {
  GelInt53: () => GelInt53,
  GelInt53Builder: () => GelInt53Builder,
  bigint: () => bigint
});
module.exports = __toCommonJS(bigint_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_int_common = require("./int.common.cjs");
class GelInt53Builder extends import_int_common.GelIntColumnBaseBuilder {
  static [import_entity.entityKind] = "GelInt53Builder";
  constructor(name) {
    super(name, "number", "GelInt53");
  }
  /** @internal */
  build(table) {
    return new GelInt53(table, this.config);
  }
}
class GelInt53 extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelInt53";
  getSQLType() {
    return "bigint";
  }
}
function bigint(name) {
  return new GelInt53Builder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelInt53,
  GelInt53Builder,
  bigint
});
//# sourceMappingURL=bigint.cjs.map