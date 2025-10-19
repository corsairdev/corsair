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
var timestamp_exports = {};
__export(timestamp_exports, {
  MySqlTimestamp: () => MySqlTimestamp,
  MySqlTimestampBuilder: () => MySqlTimestampBuilder,
  MySqlTimestampString: () => MySqlTimestampString,
  MySqlTimestampStringBuilder: () => MySqlTimestampStringBuilder,
  timestamp: () => timestamp
});
module.exports = __toCommonJS(timestamp_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_date_common = require("./date.common.cjs");
class MySqlTimestampBuilder extends import_date_common.MySqlDateColumnBaseBuilder {
  static [import_entity.entityKind] = "MySqlTimestampBuilder";
  constructor(name, config) {
    super(name, "date", "MySqlTimestamp");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestamp(
      table,
      this.config
    );
  }
}
class MySqlTimestamp extends import_date_common.MySqlDateBaseColumn {
  static [import_entity.entityKind] = "MySqlTimestamp";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, -1).replace("T", " ");
  }
}
class MySqlTimestampStringBuilder extends import_date_common.MySqlDateColumnBaseBuilder {
  static [import_entity.entityKind] = "MySqlTimestampStringBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlTimestampString");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestampString(
      table,
      this.config
    );
  }
}
class MySqlTimestampString extends import_date_common.MySqlDateBaseColumn {
  static [import_entity.entityKind] = "MySqlTimestampString";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
}
function timestamp(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "string") {
    return new MySqlTimestampStringBuilder(name, config);
  }
  return new MySqlTimestampBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlTimestamp,
  MySqlTimestampBuilder,
  MySqlTimestampString,
  MySqlTimestampStringBuilder,
  timestamp
});
//# sourceMappingURL=timestamp.cjs.map