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
var common_exports = {};
__export(common_exports, {
  GelArray: () => GelArray,
  GelArrayBuilder: () => GelArrayBuilder,
  GelColumn: () => GelColumn,
  GelColumnBuilder: () => GelColumnBuilder,
  GelExtraConfigColumn: () => GelExtraConfigColumn,
  IndexedColumn: () => IndexedColumn
});
module.exports = __toCommonJS(common_exports);
var import_column_builder = require("../../column-builder.cjs");
var import_column = require("../../column.cjs");
var import_entity = require("../../entity.cjs");
var import_foreign_keys = require("../foreign-keys.cjs");
var import_tracing_utils = require("../../tracing-utils.cjs");
var import_unique_constraint = require("../unique-constraint.cjs");
class GelColumnBuilder extends import_column_builder.ColumnBuilder {
  foreignKeyConfigs = [];
  static [import_entity.entityKind] = "GelColumnBuilder";
  array(size) {
    return new GelArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return (0, import_tracing_utils.iife)(
        (ref2, actions2) => {
          const builder = new import_foreign_keys.ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table) {
    return new GelExtraConfigColumn(table, this.config);
  }
}
class GelColumn extends import_column.Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [import_entity.entityKind] = "GelColumn";
}
class GelExtraConfigColumn extends GelColumn {
  static [import_entity.entityKind] = "GelExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `Gel_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
}
class IndexedColumn {
  static [import_entity.entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
}
class GelArrayBuilder extends GelColumnBuilder {
  static [import_entity.entityKind] = "GelArrayBuilder";
  constructor(name, baseBuilder, size) {
    super(name, "array", "GelArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new GelArray(
      table,
      this.config,
      baseColumn
    );
  }
}
class GelArray extends GelColumn {
  constructor(table, config, baseColumn, range) {
    super(table, config);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config.size;
  }
  size;
  static [import_entity.entityKind] = "GelArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelArray,
  GelArrayBuilder,
  GelColumn,
  GelColumnBuilder,
  GelExtraConfigColumn,
  IndexedColumn
});
//# sourceMappingURL=common.cjs.map