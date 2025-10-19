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
var bytes_exports = {};
__export(bytes_exports, {
  GelBytes: () => GelBytes,
  GelBytesBuilder: () => GelBytesBuilder,
  bytes: () => bytes
});
module.exports = __toCommonJS(bytes_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelBytesBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelBytesBuilder";
  constructor(name) {
    super(name, "buffer", "GelBytes");
  }
  /** @internal */
  build(table) {
    return new GelBytes(
      table,
      this.config
    );
  }
}
class GelBytes extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelBytes";
  getSQLType() {
    return "bytea";
  }
}
function bytes(name) {
  return new GelBytesBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelBytes,
  GelBytesBuilder,
  bytes
});
//# sourceMappingURL=bytes.cjs.map