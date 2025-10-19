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
var uuid_exports = {};
__export(uuid_exports, {
  GelUUID: () => GelUUID,
  GelUUIDBuilder: () => GelUUIDBuilder,
  uuid: () => uuid
});
module.exports = __toCommonJS(uuid_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelUUIDBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelUUIDBuilder";
  constructor(name) {
    super(name, "string", "GelUUID");
  }
  /** @internal */
  build(table) {
    return new GelUUID(table, this.config);
  }
}
class GelUUID extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelUUID";
  getSQLType() {
    return "uuid";
  }
}
function uuid(name) {
  return new GelUUIDBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelUUID,
  GelUUIDBuilder,
  uuid
});
//# sourceMappingURL=uuid.cjs.map