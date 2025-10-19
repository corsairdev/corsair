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
var json_exports = {};
__export(json_exports, {
  GelJson: () => GelJson,
  GelJsonBuilder: () => GelJsonBuilder,
  json: () => json
});
module.exports = __toCommonJS(json_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelJsonBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelJsonBuilder";
  constructor(name) {
    super(name, "json", "GelJson");
  }
  /** @internal */
  build(table) {
    return new GelJson(table, this.config);
  }
}
class GelJson extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
}
function json(name) {
  return new GelJsonBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelJson,
  GelJsonBuilder,
  json
});
//# sourceMappingURL=json.cjs.map