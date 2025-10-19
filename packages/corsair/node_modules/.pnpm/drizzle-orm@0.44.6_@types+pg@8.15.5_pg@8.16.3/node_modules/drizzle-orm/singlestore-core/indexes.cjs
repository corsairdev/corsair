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
var indexes_exports = {};
__export(indexes_exports, {
  Index: () => Index,
  IndexBuilder: () => IndexBuilder,
  IndexBuilderOn: () => IndexBuilderOn,
  index: () => index,
  uniqueIndex: () => uniqueIndex
});
module.exports = __toCommonJS(indexes_exports);
var import_entity = require("../entity.cjs");
class IndexBuilderOn {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  static [import_entity.entityKind] = "SingleStoreIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}
class IndexBuilder {
  static [import_entity.entityKind] = "SingleStoreIndexBuilder";
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique
    };
  }
  using(using) {
    this.config.using = using;
    return this;
  }
  algorythm(algorythm) {
    this.config.algorythm = algorythm;
    return this;
  }
  lock(lock) {
    this.config.lock = lock;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
}
class Index {
  static [import_entity.entityKind] = "SingleStoreIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
}
function index(name) {
  return new IndexBuilderOn(name, false);
}
function uniqueIndex(name) {
  return new IndexBuilderOn(name, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Index,
  IndexBuilder,
  IndexBuilderOn,
  index,
  uniqueIndex
});
//# sourceMappingURL=indexes.cjs.map