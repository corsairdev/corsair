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
var smallserial_exports = {};
__export(smallserial_exports, {
  PgSmallSerial: () => PgSmallSerial,
  PgSmallSerialBuilder: () => PgSmallSerialBuilder,
  smallserial: () => smallserial
});
module.exports = __toCommonJS(smallserial_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgSmallSerialBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSmallSerial(
      table,
      this.config
    );
  }
}
class PgSmallSerial extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgSmallSerial";
  getSQLType() {
    return "smallserial";
  }
}
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgSmallSerial,
  PgSmallSerialBuilder,
  smallserial
});
//# sourceMappingURL=smallserial.cjs.map