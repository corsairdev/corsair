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
var primary_key_exports = {};
__export(primary_key_exports, {
  PrimaryKey: () => PrimaryKey
});
module.exports = __toCommonJS(primary_key_exports);
var import_entity = require("./entity.cjs");
class PrimaryKey {
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }
  static [import_entity.entityKind] = "PrimaryKey";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrimaryKey
});
//# sourceMappingURL=primary-key.cjs.map