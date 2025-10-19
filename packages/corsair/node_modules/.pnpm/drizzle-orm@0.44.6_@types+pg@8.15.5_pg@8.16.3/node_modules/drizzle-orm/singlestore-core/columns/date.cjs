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
  SingleStoreDate: () => SingleStoreDate,
  SingleStoreDateBuilder: () => SingleStoreDateBuilder,
  SingleStoreDateString: () => SingleStoreDateString,
  SingleStoreDateStringBuilder: () => SingleStoreDateStringBuilder,
  date: () => date
});
module.exports = __toCommonJS(date_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreDateBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreDateBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreDate");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDate(
      table,
      this.config
    );
  }
}
class SingleStoreDate extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreDate";
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
class SingleStoreDateStringBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreDateStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreDateString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateString(
      table,
      this.config
    );
  }
}
class SingleStoreDateString extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreDateString";
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
    return new SingleStoreDateStringBuilder(name);
  }
  return new SingleStoreDateBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreDate,
  SingleStoreDateBuilder,
  SingleStoreDateString,
  SingleStoreDateStringBuilder,
  date
});
//# sourceMappingURL=date.cjs.map