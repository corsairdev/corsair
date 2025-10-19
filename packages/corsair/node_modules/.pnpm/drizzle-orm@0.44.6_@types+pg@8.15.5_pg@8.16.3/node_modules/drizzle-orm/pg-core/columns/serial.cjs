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
var serial_exports = {};
__export(serial_exports, {
  PgSerial: () => PgSerial,
  PgSerialBuilder: () => PgSerialBuilder,
  serial: () => serial
});
module.exports = __toCommonJS(serial_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgSerialBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
}
class PgSerial extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgSerial";
  getSQLType() {
    return "serial";
  }
}
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgSerial,
  PgSerialBuilder,
  serial
});
//# sourceMappingURL=serial.cjs.map