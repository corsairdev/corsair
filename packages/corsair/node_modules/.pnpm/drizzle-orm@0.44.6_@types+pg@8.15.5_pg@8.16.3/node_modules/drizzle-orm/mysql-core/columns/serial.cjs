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
  MySqlSerial: () => MySqlSerial,
  MySqlSerialBuilder: () => MySqlSerialBuilder,
  serial: () => serial
});
module.exports = __toCommonJS(serial_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class MySqlSerialBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlSerialBuilder";
  constructor(name) {
    super(name, "number", "MySqlSerial");
    this.config.hasDefault = true;
    this.config.autoIncrement = true;
  }
  /** @internal */
  build(table) {
    return new MySqlSerial(table, this.config);
  }
}
class MySqlSerial extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlSerial";
  getSQLType() {
    return "serial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function serial(name) {
  return new MySqlSerialBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlSerial,
  MySqlSerialBuilder,
  serial
});
//# sourceMappingURL=serial.cjs.map