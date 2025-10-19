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
  PgDate: () => PgDate,
  PgDateBuilder: () => PgDateBuilder,
  PgDateString: () => PgDateString,
  PgDateStringBuilder: () => PgDateStringBuilder,
  date: () => date
});
module.exports = __toCommonJS(date_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
var import_date_common = require("./date.common.cjs");
class PgDateBuilder extends import_date_common.PgDateColumnBaseBuilder {
  static [import_entity.entityKind] = "PgDateBuilder";
  constructor(name) {
    super(name, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
}
class PgDate extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
}
class PgDateStringBuilder extends import_date_common.PgDateColumnBaseBuilder {
  static [import_entity.entityKind] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(
      table,
      this.config
    );
  }
}
class PgDateString extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgDateString";
  getSQLType() {
    return "date";
  }
}
function date(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "date") {
    return new PgDateBuilder(name);
  }
  return new PgDateStringBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgDate,
  PgDateBuilder,
  PgDateString,
  PgDateStringBuilder,
  date
});
//# sourceMappingURL=date.cjs.map