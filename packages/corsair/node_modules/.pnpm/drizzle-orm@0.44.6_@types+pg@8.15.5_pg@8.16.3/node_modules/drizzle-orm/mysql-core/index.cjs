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
var mysql_core_exports = {};
module.exports = __toCommonJS(mysql_core_exports);
__reExport(mysql_core_exports, require("./alias.cjs"), module.exports);
__reExport(mysql_core_exports, require("./checks.cjs"), module.exports);
__reExport(mysql_core_exports, require("./columns/index.cjs"), module.exports);
__reExport(mysql_core_exports, require("./db.cjs"), module.exports);
__reExport(mysql_core_exports, require("./dialect.cjs"), module.exports);
__reExport(mysql_core_exports, require("./foreign-keys.cjs"), module.exports);
__reExport(mysql_core_exports, require("./indexes.cjs"), module.exports);
__reExport(mysql_core_exports, require("./primary-keys.cjs"), module.exports);
__reExport(mysql_core_exports, require("./query-builders/index.cjs"), module.exports);
__reExport(mysql_core_exports, require("./schema.cjs"), module.exports);
__reExport(mysql_core_exports, require("./session.cjs"), module.exports);
__reExport(mysql_core_exports, require("./subquery.cjs"), module.exports);
__reExport(mysql_core_exports, require("./table.cjs"), module.exports);
__reExport(mysql_core_exports, require("./unique-constraint.cjs"), module.exports);
__reExport(mysql_core_exports, require("./utils.cjs"), module.exports);
__reExport(mysql_core_exports, require("./view-common.cjs"), module.exports);
__reExport(mysql_core_exports, require("./view.cjs"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ...require("./alias.cjs"),
  ...require("./checks.cjs"),
  ...require("./columns/index.cjs"),
  ...require("./db.cjs"),
  ...require("./dialect.cjs"),
  ...require("./foreign-keys.cjs"),
  ...require("./indexes.cjs"),
  ...require("./primary-keys.cjs"),
  ...require("./query-builders/index.cjs"),
  ...require("./schema.cjs"),
  ...require("./session.cjs"),
  ...require("./subquery.cjs"),
  ...require("./table.cjs"),
  ...require("./unique-constraint.cjs"),
  ...require("./utils.cjs"),
  ...require("./view-common.cjs"),
  ...require("./view.cjs")
});
//# sourceMappingURL=index.cjs.map