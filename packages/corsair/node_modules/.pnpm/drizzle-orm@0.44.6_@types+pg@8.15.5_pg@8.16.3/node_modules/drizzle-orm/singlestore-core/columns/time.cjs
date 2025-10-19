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
var time_exports = {};
__export(time_exports, {
  SingleStoreTime: () => SingleStoreTime,
  SingleStoreTimeBuilder: () => SingleStoreTimeBuilder,
  time: () => time
});
module.exports = __toCommonJS(time_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class SingleStoreTimeBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreTimeBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreTime");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTime(
      table,
      this.config
    );
  }
}
class SingleStoreTime extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreTime";
  getSQLType() {
    return `time`;
  }
}
function time(name) {
  return new SingleStoreTimeBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreTime,
  SingleStoreTimeBuilder,
  time
});
//# sourceMappingURL=time.cjs.map