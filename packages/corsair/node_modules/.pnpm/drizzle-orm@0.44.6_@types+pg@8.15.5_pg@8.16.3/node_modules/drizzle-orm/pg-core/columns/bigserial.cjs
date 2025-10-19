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
var bigserial_exports = {};
__export(bigserial_exports, {
  PgBigSerial53: () => PgBigSerial53,
  PgBigSerial53Builder: () => PgBigSerial53Builder,
  PgBigSerial64: () => PgBigSerial64,
  PgBigSerial64Builder: () => PgBigSerial64Builder,
  bigserial: () => bigserial
});
module.exports = __toCommonJS(bigserial_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class PgBigSerial53Builder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial53(
      table,
      this.config
    );
  }
}
class PgBigSerial53 extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBigSerial53";
  getSQLType() {
    return "bigserial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class PgBigSerial64Builder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigSerial64");
    this.config.hasDefault = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial64(
      table,
      this.config
    );
  }
}
class PgBigSerial64 extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBigSerial64";
  getSQLType() {
    return "bigserial";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigserial(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config.mode === "number") {
    return new PgBigSerial53Builder(name);
  }
  return new PgBigSerial64Builder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgBigSerial53,
  PgBigSerial53Builder,
  PgBigSerial64,
  PgBigSerial64Builder,
  bigserial
});
//# sourceMappingURL=bigserial.cjs.map