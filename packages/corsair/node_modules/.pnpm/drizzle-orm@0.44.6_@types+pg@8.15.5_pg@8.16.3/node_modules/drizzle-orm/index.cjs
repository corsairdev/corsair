"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("./alias.cjs"), module.exports);
__reExport(index_exports, require("./column-builder.cjs"), module.exports);
__reExport(index_exports, require("./column.cjs"), module.exports);
__reExport(index_exports, require("./entity.cjs"), module.exports);
__reExport(index_exports, require("./errors.cjs"), module.exports);
__reExport(index_exports, require("./logger.cjs"), module.exports);
__reExport(index_exports, require("./operations.cjs"), module.exports);
__reExport(index_exports, require("./query-promise.cjs"), module.exports);
__reExport(index_exports, require("./relations.cjs"), module.exports);
__reExport(index_exports, require("./sql/index.cjs"), module.exports);
__reExport(index_exports, require("./subquery.cjs"), module.exports);
__reExport(index_exports, require("./table.cjs"), module.exports);
__reExport(index_exports, require("./utils.cjs"), module.exports);
__reExport(index_exports, require("./view-common.cjs"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ...require("./alias.cjs"),
  ...require("./column-builder.cjs"),
  ...require("./column.cjs"),
  ...require("./entity.cjs"),
  ...require("./errors.cjs"),
  ...require("./logger.cjs"),
  ...require("./operations.cjs"),
  ...require("./query-promise.cjs"),
  ...require("./relations.cjs"),
  ...require("./sql/index.cjs"),
  ...require("./subquery.cjs"),
  ...require("./table.cjs"),
  ...require("./utils.cjs"),
  ...require("./view-common.cjs")
});
//# sourceMappingURL=index.cjs.map