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
var inet_exports = {};
__export(inet_exports, {
  PgInet: () => PgInet,
  PgInetBuilder: () => PgInetBuilder,
  inet: () => inet
});
module.exports = __toCommonJS(inet_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgInetBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgInetBuilder";
  constructor(name) {
    super(name, "string", "PgInet");
  }
  /** @internal */
  build(table) {
    return new PgInet(table, this.config);
  }
}
class PgInet extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgInet";
  getSQLType() {
    return "inet";
  }
}
function inet(name) {
  return new PgInetBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgInet,
  PgInetBuilder,
  inet
});
//# sourceMappingURL=inet.cjs.map