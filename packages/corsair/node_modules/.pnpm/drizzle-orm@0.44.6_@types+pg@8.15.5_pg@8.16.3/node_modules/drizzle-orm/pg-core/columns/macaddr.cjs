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
var macaddr_exports = {};
__export(macaddr_exports, {
  PgMacaddr: () => PgMacaddr,
  PgMacaddrBuilder: () => PgMacaddrBuilder,
  macaddr: () => macaddr
});
module.exports = __toCommonJS(macaddr_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgMacaddrBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
}
class PgMacaddr extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
}
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgMacaddr,
  PgMacaddrBuilder,
  macaddr
});
//# sourceMappingURL=macaddr.cjs.map