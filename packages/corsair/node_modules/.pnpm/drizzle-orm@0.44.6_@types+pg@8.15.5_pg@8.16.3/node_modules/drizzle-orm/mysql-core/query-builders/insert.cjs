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
var insert_exports = {};
__export(insert_exports, {
  MySqlInsertBase: () => MySqlInsertBase,
  MySqlInsertBuilder: () => MySqlInsertBuilder
});
module.exports = __toCommonJS(insert_exports);
var import_entity = require("../../entity.cjs");
var import_query_promise = require("../../query-promise.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_table = require("../../table.cjs");
var import_utils = require("../../utils.cjs");
var import_utils2 = require("../utils.cjs");
var import_query_builder = require("./query-builder.cjs");
class MySqlInsertBuilder {
  constructor(table, session, dialect) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }
  static [import_entity.entityKind] = "MySqlInsertBuilder";
  shouldIgnore = false;
  ignore() {
    this.shouldIgnore = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[import_table.Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = (0, import_entity.is)(colValue, import_sql.SQL) ? colValue : new import_sql.Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new MySqlInsertBase(this.table, mappedValues, this.shouldIgnore, this.session, this.dialect);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new import_query_builder.QueryBuilder()) : selectQuery;
    if (!(0, import_entity.is)(select, import_sql.SQL) && !(0, import_utils.haveSameKeys)(this.table[import_table.Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new MySqlInsertBase(this.table, select, this.shouldIgnore, this.session, this.dialect, true);
  }
}
class MySqlInsertBase extends import_query_promise.QueryPromise {
  constructor(table, values, ignore, session, dialect, select) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, select, ignore };
  }
  static [import_entity.entityKind] = "MySqlInsert";
  config;
  cacheConfig;
  /**
   * Adds an `on duplicate key update` clause to the query.
   *
   * Calling this method will update the row if any unique index conflicts. MySQL will automatically determine the conflict target based on the primary key and unique indexes.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-duplicate-key-update}
   *
   * @param config The `set` clause
   *
   * @example
   * ```ts
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW'})
   *   .onDuplicateKeyUpdate({ set: { brand: 'Porsche' }});
   * ```
   *
   * While MySQL does not directly support doing nothing on conflict, you can perform a no-op by setting any column's value to itself and achieve the same effect:
   *
   * ```ts
   * import { sql } from 'drizzle-orm';
   *
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onDuplicateKeyUpdate({ set: { id: sql`id` } });
   * ```
   */
  onDuplicateKeyUpdate(config) {
    const setSql = this.dialect.buildUpdateSet(this.config.table, (0, import_utils.mapUpdateSet)(this.config.table, config.set));
    this.config.onConflict = import_sql.sql`update ${setSql}`;
    return this;
  }
  $returningId() {
    const returning = [];
    for (const [key, value] of Object.entries(this.config.table[import_table.Table.Symbol.Columns])) {
      if (value.primary) {
        returning.push({ field: value, path: [key] });
      }
    }
    this.config.returning = returning;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config).sql;
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    const { sql: sql2, generatedIds } = this.dialect.buildInsertQuery(this.config);
    return this.session.prepareQuery(
      this.dialect.sqlToQuery(sql2),
      void 0,
      void 0,
      generatedIds,
      this.config.returning,
      {
        type: "insert",
        tables: (0, import_utils2.extractUsedTable)(this.config.table)
      },
      this.cacheConfig
    );
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self = this;
    return async function* (placeholderValues) {
      yield* self.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
  $dynamic() {
    return this;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlInsertBase,
  MySqlInsertBuilder
});
//# sourceMappingURL=insert.cjs.map