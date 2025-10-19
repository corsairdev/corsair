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
var bigintT_exports = {};
__export(bigintT_exports, {
  GelBigInt64: () => GelBigInt64,
  GelBigInt64Builder: () => GelBigInt64Builder,
  bigintT: () => bigintT
});
module.exports = __toCommonJS(bigintT_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_int_common = require("./int.common.cjs");
class GelBigInt64Builder extends import_int_common.GelIntColumnBaseBuilder {
  static [import_entity.entityKind] = "GelBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "GelBigInt64");
  }
  /** @internal */
  build(table) {
    return new GelBigInt64(
      table,
      this.config
    );
  }
}
class GelBigInt64 extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelBigInt64";
  getSQLType() {
    return "edgedbt.bigint_t";
  }
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigintT(name) {
  return new GelBigInt64Builder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelBigInt64,
  GelBigInt64Builder,
  bigintT
});
//# sourceMappingURL=bigintT.cjs.map