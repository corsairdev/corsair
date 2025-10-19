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
var count_exports = {};
__export(count_exports, {
  MySqlCountBuilder: () => MySqlCountBuilder
});
module.exports = __toCommonJS(count_exports);
var import_entity = require("../../entity.cjs");
var import_sql = require("../../sql/sql.cjs");
class MySqlCountBuilder extends import_sql.SQL {
  constructor(params) {
    super(MySqlCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.mapWith(Number);
    this.session = params.session;
    this.sql = MySqlCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  static [import_entity.entityKind] = "MySqlCountBuilder";
  [Symbol.toStringTag] = "MySqlCountBuilder";
  session;
  static buildEmbeddedCount(source, filters) {
    return import_sql.sql`(select count(*) from ${source}${import_sql.sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return import_sql.sql`select count(*) as count from ${source}${import_sql.sql.raw(" where ").if(filters)}${filters}`;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlCountBuilder
});
//# sourceMappingURL=count.cjs.map