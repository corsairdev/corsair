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
var checks_exports = {};
__export(checks_exports, {
  Check: () => Check,
  CheckBuilder: () => CheckBuilder,
  check: () => check
});
module.exports = __toCommonJS(checks_exports);
var import_entity = require("../entity.cjs");
class CheckBuilder {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  static [import_entity.entityKind] = "MySqlCheckBuilder";
  brand;
  /** @internal */
  build(table) {
    return new Check(table, this);
  }
}
class Check {
  constructor(table, builder) {
    this.table = table;
    this.name = builder.name;
    this.value = builder.value;
  }
  static [import_entity.entityKind] = "MySqlCheck";
  name;
  value;
}
function check(name, value) {
  return new CheckBuilder(name, value);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Check,
  CheckBuilder,
  check
});
//# sourceMappingURL=checks.cjs.map