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
var date_duration_exports = {};
__export(date_duration_exports, {
  GelDateDuration: () => GelDateDuration,
  GelDateDurationBuilder: () => GelDateDurationBuilder,
  dateDuration: () => dateDuration
});
module.exports = __toCommonJS(date_duration_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelDateDurationBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelDateDurationBuilder";
  constructor(name) {
    super(name, "dateDuration", "GelDateDuration");
  }
  /** @internal */
  build(table) {
    return new GelDateDuration(
      table,
      this.config
    );
  }
}
class GelDateDuration extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelDateDuration";
  getSQLType() {
    return `dateDuration`;
  }
}
function dateDuration(name) {
  return new GelDateDurationBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelDateDuration,
  GelDateDurationBuilder,
  dateDuration
});
//# sourceMappingURL=date-duration.cjs.map