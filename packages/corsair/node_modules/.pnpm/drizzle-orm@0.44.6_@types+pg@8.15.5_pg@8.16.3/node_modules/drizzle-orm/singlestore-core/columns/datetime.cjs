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
  SingleStoreDateTime: () => SingleStoreDateTime,
  SingleStoreDateTimeBuilder: () => SingleStoreDateTimeBuilder,
  SingleStoreDateTimeString: () => SingleStoreDateTimeString,
  SingleStoreDateTimeStringBuilder: () => SingleStoreDateTimeStringBuilder,
  datetime: () => datetime
});
module.exports = __toCommonJS(datetime_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreDateTimeBuilder extends import_common.SingleStoreColumnBuilder {
  /** @internal */
  // TODO: we need to add a proper support for SingleStore
  generatedAlwaysAs(_as, _config) {
    throw new Error("Method not implemented.");
  }
  static [import_entity.entityKind] = "SingleStoreDateTimeBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreDateTime");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateTime(
      table,
      this.config
    );
  }
}
class SingleStoreDateTime extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreDateTime";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `datetime`;
  }
  mapToDriverValue(value) {
    return value.toISOString().replace("T", " ").replace("Z", "");
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
  }
}
class SingleStoreDateTimeStringBuilder extends import_common.SingleStoreColumnBuilder {
  /** @internal */
  // TODO: we need to add a proper support for SingleStore
  generatedAlwaysAs(_as, _config) {
    throw new Error("Method not implemented.");
  }
  static [import_entity.entityKind] = "SingleStoreDateTimeStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreDateTimeString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateTimeString(
      table,
      this.config
    );
  }
}
class SingleStoreDateTimeString extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreDateTimeString";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `datetime`;
  }
}
function datetime(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (config?.mode === "string") {
    return new SingleStoreDateTimeStringBuilder(name);
  }
  return new SingleStoreDateTimeBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreDateTime,
  SingleStoreDateTimeBuilder,
  SingleStoreDateTimeString,
  SingleStoreDateTimeStringBuilder,
  datetime
});
//# sourceMappingURL=datetime.cjs.map