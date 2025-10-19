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
var real_exports = {};
__export(real_exports, {
  GelReal: () => GelReal,
  GelRealBuilder: () => GelRealBuilder,
  real: () => real
});
module.exports = __toCommonJS(real_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelRealBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelRealBuilder";
  constructor(name, length) {
    super(name, "number", "GelReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new GelReal(table, this.config);
  }
}
class GelReal extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
}
function real(name) {
  return new GelRealBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelReal,
  GelRealBuilder,
  real
});
//# sourceMappingURL=real.cjs.map