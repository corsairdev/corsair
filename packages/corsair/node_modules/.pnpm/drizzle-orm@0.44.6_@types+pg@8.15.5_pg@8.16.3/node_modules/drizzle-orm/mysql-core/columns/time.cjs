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
  MySqlTime: () => MySqlTime,
  MySqlTimeBuilder: () => MySqlTimeBuilder,
  time: () => time
});
module.exports = __toCommonJS(time_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlTimeBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlTimeBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTime(table, this.config);
  }
}
class MySqlTime extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlTime";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `time${precision}`;
  }
}
function time(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTimeBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlTime,
  MySqlTimeBuilder,
  time
});
//# sourceMappingURL=time.cjs.map