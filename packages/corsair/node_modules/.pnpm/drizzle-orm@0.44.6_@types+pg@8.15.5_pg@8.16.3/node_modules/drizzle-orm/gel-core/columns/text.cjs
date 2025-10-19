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
var text_exports = {};
__export(text_exports, {
  GelText: () => GelText,
  GelTextBuilder: () => GelTextBuilder,
  text: () => text
});
module.exports = __toCommonJS(text_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelTextBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelTextBuilder";
  constructor(name) {
    super(name, "string", "GelText");
  }
  /** @internal */
  build(table) {
    return new GelText(table, this.config);
  }
}
class GelText extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
}
function text(name) {
  return new GelTextBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelText,
  GelTextBuilder,
  text
});
//# sourceMappingURL=text.cjs.map