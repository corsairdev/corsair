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
var date_exports = {};
__export(date_exports, {
  MySqlDate: () => MySqlDate,
  MySqlDateBuilder: () => MySqlDateBuilder,
  MySqlDateString: () => MySqlDateString,
  MySqlDateStringBuilder: () => MySqlDateStringBuilder,
  date: () => date
});
module.exports = __toCommonJS(date_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlDateBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlDateBuilder";
  constructor(name) {
    super(name, "date", "MySqlDate");
  }
  /** @internal */
  build(table) {
    return new MySqlDate(table, this.config);
  }
}
class MySqlDate extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlDate";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
}
class MySqlDateStringBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlDateStringBuilder";
  constructor(name) {
    super(name, "string", "MySqlDateString");
  }
  /** @internal */
  build(table) {
    return new MySqlDateString(
      table,
      this.config
    );
  }
}
class MySqlDateString extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlDateString";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
}
function date(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "string") {
    return new MySqlDateStringBuilder(name);
  }
  return new MySqlDateBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlDate,
  MySqlDateBuilder,
  MySqlDateString,
  MySqlDateStringBuilder,
  date
});
//# sourceMappingURL=date.cjs.map