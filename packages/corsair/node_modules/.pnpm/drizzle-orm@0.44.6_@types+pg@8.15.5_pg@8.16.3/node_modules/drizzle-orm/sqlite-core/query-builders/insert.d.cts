import { entityKind } from "../../entity.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Placeholder, Query, SQLWrapper } from "../../sql/sql.cjs";
import { Param, SQL } from "../../sql/sql.cjs";
import type { SQLiteDialect } from "../dialect.cjs";
import type { IndexColumn } from "../indexes.cjs";
import type { SQLitePreparedQuery, SQLiteSession } from "../session.cjs";
import { SQLiteTable } from "../table.cjs";
import type { Subquery } from "../../subquery.cjs";
import { type DrizzleTypeError, type Simplify } from "../../utils.cjs";
import type { AnySQLiteColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import type { SQLiteUpdateSetSource } from "./update.cjs";
export interface SQLiteInsertConfig<TTable extends SQLiteTable = SQLiteTable> {
    table: TTable;
    values: Record<string, Param | SQL>[] | SQLiteInsertSelectQueryBuilder<TTable> | SQL;
    withList?: Subquery[];
    onConflict?: SQL[];
    returning?: SelectedFieldsOrdered;
    select?: boolean;
}
export type SQLiteInsertValue<TTable extends SQLiteTable> = Simplify<{
    [Key in keyof TTable['$inferInsert']]: TTable['$inferInsert'][Key] | SQL | Placeholder;
}>;
export type SQLiteInsertSelectQueryBuilder<TTable extends SQLiteTable> = TypedQueryBuilder<{
    [K in keyof TTable['$inferInsert']]: AnySQLiteColumn | SQL | SQL.Aliased | TTable['$inferInsert'][K];
}>;
export declare class SQLiteInsertBuilder<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult> {
    protected table: TTable;
    protected session: SQLiteSession<any, any, any, any>;
    protected dialect: SQLiteDialect;
    private withList?;
    static readonly [entityKind]: string;
    constructor(table: TTable, session: SQLiteSession<any, any, any, any>, dialect: SQLiteDialect, withList?: Subquery[] | undefined);
    values(value: SQLiteInsertValue<TTable>): SQLiteInsertBase<TTable, TResultType, TRunResult>;
    values(values: SQLiteInsertValue<TTable>[]): SQLiteInsertBase<TTable, TResultType, TRunResult>;
    select(selectQuery: (qb: QueryBuilder) => SQLiteInsertSelectQueryBuilder<TTable>): SQLiteInsertBase<TTable, TResultType, TRunResult>;
    select(selectQuery: (qb: QueryBuilder) => SQL): SQLiteInsertBase<TTable, TResultType, TRunResult>;
    select(selectQuery: SQL): SQLiteInsertBase<TTable, TResultType, TRunResult>;
    select(selectQuery: SQLiteInsertSelectQueryBuilder<TTable>): SQLiteInsertBase<TTable, TResultType, TRunResult>;
}
export type SQLiteInsertWithout<T extends AnySQLiteInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SQLiteInsertBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type SQLiteInsertReturning<T extends AnySQLiteInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = SQLiteInsertWithout<SQLiteInsertBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteInsertReturningAll<T extends AnySQLiteInsert, TDynamic extends boolean> = SQLiteInsertWithout<SQLiteInsertBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteInsertOnConflictDoUpdateConfig<T extends AnySQLiteInsert> = {
    target: IndexColumn | IndexColumn[];
    /** @deprecated - use either `targetWhere` or `setWhere` */
    where?: SQL;
    targetWhere?: SQL;
    setWhere?: SQL;
    set: SQLiteUpdateSetSource<T['_']['table']>;
};
export type SQLiteInsertDynamic<T extends AnySQLiteInsert> = SQLiteInsert<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['returning']>;
export type SQLiteInsertExecute<T extends AnySQLiteInsert> = T['_']['returning'] extends undefined ? T['_']['runResult'] : T['_']['returning'][];
export type SQLiteInsertPrepare<T extends AnySQLiteInsert> = SQLitePreparedQuery<{
    type: T['_']['resultType'];
    run: T['_']['runResult'];
    all: T['_']['returning'] extends undefined ? DrizzleTypeError<'.all() cannot be used without .returning()'> : T['_']['returning'][];
    get: T['_']['returning'] extends undefined ? DrizzleTypeError<'.get() cannot be used without .returning()'> : T['_']['returning'];
    values: T['_']['returning'] extends undefined ? DrizzleTypeError<'.values() cannot be used without .returning()'> : any[][];
    execute: SQLiteInsertExecute<T>;
}>;
export type AnySQLiteInsert = SQLiteInsertBase<any, any, any, any, any, any>;
export type SQLiteInsert<TTable extends SQLiteTable = SQLiteTable, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TReturning = any> = SQLiteInsertBase<TTable, TResultType, TRunResult, TReturning, true, never>;
export interface SQLiteInsertBase<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends SQLWrapper, QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]>, RunnableQuery<TReturning extends undefined ? TRunResult : TReturning[], 'sqlite'> {
    readonly _: {
        readonly dialect: 'sqlite';
        readonly table: TTable;
        readonly resultType: TResultType;
        readonly runResult: TRunResult;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? TRunResult : TReturning[];
    };
}
export declare class SQLiteInsertBase<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]> implements RunnableQuery<TReturning extends undefined ? TRunResult : TReturning[], 'sqlite'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    constructor(table: TTable, values: SQLiteInsertConfig['values'], session: SQLiteSession<any, any, any, any>, dialect: SQLiteDialect, withList?: Subquery[], select?: boolean);
    /**
     * Adds a `returning` clause to the query.
     *
     * Calling this method will return the specified fields of the inserted rows. If no fields are specified, all fields will be returned.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#insert-returning}
     *
     * @example
     * ```ts
     * // Insert one row and return all fields
     * const insertedCar: Car[] = await db.insert(cars)
     *   .values({ brand: 'BMW' })
     *   .returning();
     *
     * // Insert one row and return only the id
     * const insertedCarId: { id: number }[] = await db.insert(cars)
     *   .values({ brand: 'BMW' })
     *   .returning({ id: cars.id });
     * ```
     */
    returning(): SQLiteInsertReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): SQLiteInsertReturning<this, TDynamic, TSelectedFields>;
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
    onConflictDoNothing(config?: {
        target?: IndexColumn | IndexColumn[];
        where?: SQL;
    }): this;
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
     *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
     *   });
     * ```
     */
    onConflictDoUpdate(config: SQLiteInsertOnConflictDoUpdateConfig<this>): this;
    toSQL(): Query;
    prepare(): SQLiteInsertPrepare<this>;
    run: ReturnType<this['prepare']>['run'];
    all: ReturnType<this['prepare']>['all'];
    get: ReturnType<this['prepare']>['get'];
    values: ReturnType<this['prepare']>['values'];
    execute(): Promise<SQLiteInsertExecute<this>>;
    $dynamic(): SQLiteInsertDynamic<this>;
}
