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
var datetime_exports = {};
__export(datetime_exports, {
  MySqlDateTime: () => MySqlDateTime,
  MySqlDateTimeBuilder: () => MySqlDateTimeBuilder,
  MySqlDateTimeString: () => MySqlDateTimeString,
  MySqlDateTimeStringBuilder: () => MySqlDateTimeStringBuilder,
  datetime: () => datetime
});
module.exports = __toCommonJS(datetime_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlDateTimeBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlDateTimeBuilder";
  constructor(name, config) {
    super(name, "date", "MySqlDateTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTime(
      table,
      this.config
    );
  }
}
class MySqlDateTime extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlDateTime";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
  mapToDriverValue(value) {
    return value.toISOString().replace("T", " ").replace("Z", "");
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
  }
}
class MySqlDateTimeStringBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlDateTimeStringBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlDateTimeString");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTimeString(
      table,
      this.config
    );
  }
}
class MySqlDateTimeString extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlDateTimeString";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
}
function datetime(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "string") {
    return new MySqlDateTimeStringBuilder(name, config);
  }
  return new MySqlDateTimeBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlDateTime,
  MySqlDateTimeBuilder,
  MySqlDateTimeString,
  MySqlDateTimeStringBuilder,
  datetime
});
//# sourceMappingURL=datetime.cjs.map