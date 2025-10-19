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
var all_exports = {};
__export(all_exports, {
  getSQLiteColumnBuilders: () => getSQLiteColumnBuilders
});
module.exports = __toCommonJS(all_exports);
var import_blob = require("./blob.cjs");
var import_custom = require("./custom.cjs");
var import_integer = require("./integer.cjs");
var import_numeric = require("./numeric.cjs");
var import_real = require("./real.cjs");
var import_text = require("./text.cjs");
function getSQLiteColumnBuilders() {
  return {
    blob: import_blob.blob,
    customType: import_custom.customType,
    integer: import_integer.integer,
    numeric: import_numeric.numeric,
    real: import_real.real,
    text: import_text.text
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSQLiteColumnBuilders
});
//# sourceMappingURL=all.cjs.map