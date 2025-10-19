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
var relative_duration_exports = {};
__export(relative_duration_exports, {
  GelRelDuration: () => GelRelDuration,
  GelRelDurationBuilder: () => GelRelDurationBuilder,
  relDuration: () => relDuration
});
module.exports = __toCommonJS(relative_duration_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelRelDurationBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelRelDurationBuilder";
  constructor(name) {
    super(name, "relDuration", "GelRelDuration");
  }
  /** @internal */
  build(table) {
    return new GelRelDuration(
      table,
      this.config
    );
  }
}
class GelRelDuration extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelRelDuration";
  getSQLType() {
    return `edgedbt.relative_duration_t`;
  }
}
function relDuration(name) {
  return new GelRelDurationBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelRelDuration,
  GelRelDurationBuilder,
  relDuration
});
//# sourceMappingURL=relative-duration.cjs.map