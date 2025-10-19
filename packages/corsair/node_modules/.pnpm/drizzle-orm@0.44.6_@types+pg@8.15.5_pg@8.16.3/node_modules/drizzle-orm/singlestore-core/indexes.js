import { entityKind } from "../entity.js";
class IndexBuilderOn {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  static [entityKind] = "SingleStoreIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}
class IndexBuilder {
  static [entityKind] = "SingleStoreIndexBuilder";
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
  static [entityKind] = "SingleStoreIndex";
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
export {
  Index,
  IndexBuilder,
  IndexBuilderOn,
  index,
  uniqueIndex
};
//# sourceMappingURL=indexes.js.map