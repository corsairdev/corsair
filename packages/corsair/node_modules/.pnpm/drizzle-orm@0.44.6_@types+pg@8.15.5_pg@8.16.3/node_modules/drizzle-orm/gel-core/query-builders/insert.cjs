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
  GelInsertBase: () => GelInsertBase,
  GelInsertBuilder: () => GelInsertBuilder
});
module.exports = __toCommonJS(insert_exports);
var import_entity = require("../../entity.cjs");
var import_query_promise = require("../../query-promise.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_table = require("../../table.cjs");
var import_tracing = require("../../tracing.cjs");
var import_utils = require("../../utils.cjs");
var import_utils2 = require("../utils.cjs");
var import_query_builder = require("./query-builder.cjs");
class GelInsertBuilder {
  constructor(table, session, dialect, withList, overridingSystemValue_) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
  }
  static [import_entity.entityKind] = "GelInsertBuilder";
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  overridingSystemValue() {
    this.overridingSystemValue_ = true;
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
    return new GelInsertBase(
      this.table,
      mappedValues,
      this.session,
      this.dialect,
      this.withList,
      false,
      this.overridingSystemValue_
    );
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new import_query_builder.QueryBuilder()) : selectQuery;
    if (!(0, import_entity.is)(select, import_sql.SQL) && !(0, import_utils.haveSameKeys)(this.table[import_table.Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new GelInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
}
class GelInsertBase extends import_query_promise.QueryPromise {
  constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList, select, overridingSystemValue_ };
  }
  static [import_entity.entityKind] = "GelInsert";
  config;
  returning(fields = this.config.table[import_table.Table.Symbol.Columns]) {
    this.config.returning = (0, import_utils.orderSelectedFields)(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  // TODO not supported
  // onConflictDoNothing(
  // 	config: { target?: IndexColumn | IndexColumn[]; where?: SQL } = {},
  // ): GelInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'> {
  // 	if (config.target === undefined) {
  // 		this.config.onConflict = sql`do nothing`;
  // 	} else {
  // 		let targetColumn = '';
  // 		targetColumn = Array.isArray(config.target)
  // 			? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(',')
  // 			: this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
  // 		const whereSql = config.where ? sql` where ${config.where}` : undefined;
  // 		this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
  // 	}
  // 	return this as any;
  // }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  // TODO not supported
  // onConflictDoUpdate(
  // 	config: GelInsertOnConflictDoUpdateConfig<this>,
  // ): GelInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'> {
  // 	if (config.where && (config.targetWhere || config.setWhere)) {
  // 		throw new Error(
  // 			'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.',
  // 		);
  // 	}
  // 	const whereSql = config.where ? sql` where ${config.where}` : undefined;
  // 	const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : undefined;
  // 	const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : undefined;
  // 	const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
  // 	let targetColumn = '';
  // 	targetColumn = Array.isArray(config.target)
  // 		? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(',')
  // 		: this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
  // 	this.config.onConflict = sql`(${
  // 		sql.raw(targetColumn)
  // 	})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
  // 	return this as any;
  // }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
        type: "insert",
        tables: (0, import_utils2.extractUsedTable)(this.config.table)
      });
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  execute = (placeholderValues) => {
    return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
  $dynamic() {
    return this;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelInsertBase,
  GelInsertBuilder
});
//# sourceMappingURL=insert.cjs.map