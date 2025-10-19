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
var raw_exports = {};
__export(raw_exports, {
  GelRaw: () => GelRaw
});
module.exports = __toCommonJS(raw_exports);
var import_entity = require("../../entity.cjs");
var import_query_promise = require("../../query-promise.cjs");
class GelRaw extends import_query_promise.QueryPromise {
  constructor(execute, sql, query, mapBatchResult) {
    super();
    this.execute = execute;
    this.sql = sql;
    this.query = query;
    this.mapBatchResult = mapBatchResult;
  }
  static [import_entity.entityKind] = "GelRaw";
  /** @internal */
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelRaw
});
//# sourceMappingURL=raw.cjs.map