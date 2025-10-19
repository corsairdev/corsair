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
var duration_exports = {};
__export(duration_exports, {
  GelDuration: () => GelDuration,
  GelDurationBuilder: () => GelDurationBuilder,
  duration: () => duration
});
module.exports = __toCommonJS(duration_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelDurationBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelDurationBuilder";
  constructor(name) {
    super(name, "duration", "GelDuration");
  }
  /** @internal */
  build(table) {
    return new GelDuration(table, this.config);
  }
}
class GelDuration extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelDuration";
  getSQLType() {
    return `duration`;
  }
}
function duration(name) {
  return new GelDurationBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelDuration,
  GelDurationBuilder,
  duration
});
//# sourceMappingURL=duration.cjs.map