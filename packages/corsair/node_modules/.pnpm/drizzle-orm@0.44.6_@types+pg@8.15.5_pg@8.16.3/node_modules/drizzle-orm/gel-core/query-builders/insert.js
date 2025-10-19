import { entityKind, is } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { Param, SQL } from "../../sql/sql.js";
import { Columns, Table } from "../../table.js";
import { tracer } from "../../tracing.js";
import { haveSameKeys, orderSelectedFields } from "../../utils.js";
import { extractUsedTable } from "../utils.js";
import { QueryBuilder } from "./query-builder.js";
class GelInsertBuilder {
  constructor(table, session, dialect, withList, overridingSystemValue_) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
  }
  static [entityKind] = "GelInsertBuilder";
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
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
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
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new GelInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
}
class GelInsertBase extends QueryPromise {
  constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList, select, overridingSystemValue_ };
  }
  static [entityKind] = "GelInsert";
  config;
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
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
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      });
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
  $dynamic() {
    return this;
  }
}
export {
  GelInsertBase,
  GelInsertBuilder
};
//# sourceMappingURL=insert.js.map