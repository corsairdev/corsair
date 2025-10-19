import { entityKind } from "../../entity.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { SQLiteDialect } from "../dialect.cjs";
import type { SQLitePreparedQuery, SQLiteSession } from "../session.cjs";
import { SQLiteTable } from "../table.cjs";
import type { Subquery } from "../../subquery.cjs";
import { type DrizzleTypeError, type ValueOrArray } from "../../utils.cjs";
import type { SQLiteColumn } from "../columns/common.cjs";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
export type SQLiteDeleteWithout<T extends AnySQLiteDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SQLiteDeleteBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type SQLiteDelete<TTable extends SQLiteTable = SQLiteTable, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TReturning extends Record<string, unknown> | undefined = undefined> = SQLiteDeleteBase<TTable, TResultType, TRunResult, TReturning, true, never>;
export interface SQLiteDeleteConfig {
    where?: SQL | undefined;
    limit?: number | Placeholder;
    orderBy?: (SQLiteColumn | SQL | SQL.Aliased)[];
    table: SQLiteTable;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type SQLiteDeleteReturningAll<T extends AnySQLiteDeleteBase, TDynamic extends boolean> = SQLiteDeleteWithout<SQLiteDeleteBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['table']['$inferSelect'], T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteDeleteReturning<T extends AnySQLiteDeleteBase, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = SQLiteDeleteWithout<SQLiteDeleteBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], SelectResultFields<TSelectedFields>, T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteDeleteExecute<T extends AnySQLiteDeleteBase> = T['_']['returning'] extends undefined ? T['_']['runResult'] : T['_']['returning'][];
export type SQLiteDeletePrepare<T extends AnySQLiteDeleteBase> = SQLitePreparedQuery<{
    type: T['_']['resultType'];
    run: T['_']['runResult'];
    all: T['_']['returning'] extends undefined ? DrizzleTypeError<'.all() cannot be used without .returning()'> : T['_']['returning'][];
    get: T['_']['returning'] extends undefined ? DrizzleTypeError<'.get() cannot be used without .returning()'> : T['_']['returning'] | undefined;
    values: T['_']['returning'] extends undefined ? DrizzleTypeError<'.values() cannot be used without .returning()'> : any[][];
    execute: SQLiteDeleteExecute<T>;
}>;
export type SQLiteDeleteDynamic<T extends AnySQLiteDeleteBase> = SQLiteDelete<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['returning']>;
export type AnySQLiteDeleteBase = SQLiteDeleteBase<any, any, any, any, any, any>;
export interface SQLiteDeleteBase<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]>, RunnableQuery<TReturning extends undefined ? TRunResult : TReturning[], 'sqlite'>, SQLWrapper {
    readonly _: {
        dialect: 'sqlite';
        readonly table: TTable;
        readonly resultType: TResultType;
        readonly runResult: TRunResult;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? TRunResult : TReturning[];
    };
}
export declare class SQLiteDeleteBase<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]> implements RunnableQuery<TReturning extends undefined ? TRunResult : TReturning[], 'sqlite'>, SQLWrapper {
    private table;
    private session;
    private dialect;
    static readonly [entityKind]: string;
    constructor(table: TTable, session: SQLiteSession<any, any, any, any>, dialect: SQLiteDialect, withList?: Subquery[]);
    /**
     * Adds a `where` clause to the query.
     *
     * Calling this method will delete only those rows that fulfill a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/delete}
     *
     * @param where the `where` clause.
     *
     * @example
     * You can use conditional operators and `sql function` to filter the rows to be deleted.
     *
     * ```ts
     * // Delete all cars with green color
     * db.delete(cars).where(eq(cars.color, 'green'));
     * // or
     * db.delete(cars).where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Delete all BMW cars with a green color
     * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Delete all cars with the green or blue color
     * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where: SQL | undefined): SQLiteDeleteWithout<this, TDynamic, 'where'>;
    orderBy(builder: (deleteTable: TTable) => ValueOrArray<SQLiteColumn | SQL | SQL.Aliased>): SQLiteDeleteWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (SQLiteColumn | SQL | SQL.Aliased)[]): SQLiteDeleteWithout<this, TDynamic, 'orderBy'>;
    limit(limit: number | Placeholder): SQLiteDeleteWithout<this, TDynamic, 'limit'>;
    /**
     * Adds a `returning` clause to the query.
     *
     * Calling this method will return the specified fields of the deleted rows. If no fields are specified, all fields will be returned.
     *
     * See docs: {@link https://orm.drizzle.team/docs/delete#delete-with-return}
     *
     * @example
     * ```ts
     * // Delete all cars with the green color and return all fields
     * const deletedCars: Car[] = await db.delete(cars)
     *   .where(eq(cars.color, 'green'))
     *   .returning();
     *
     * // Delete all cars with the green color and return only their id and brand fields
     * const deletedCarsIdsAndBrands: { id: number, brand: string }[] = await db.delete(cars)
     *   .where(eq(cars.color, 'green'))
     *   .returning({ id: cars.id, brand: cars.brand });
     * ```
     */
    returning(): SQLiteDeleteReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): SQLiteDeleteReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(): SQLiteDeletePrepare<this>;
    run: ReturnType<this['prepare']>['run'];
    all: ReturnType<this['prepare']>['all'];
    get: ReturnType<this['prepare']>['get'];
    values: ReturnType<this['prepare']>['values'];
    execute(placeholderValues?: Record<string, unknown>): Promise<SQLiteDeleteExecute<this>>;
    $dynamic(): SQLiteDeleteDynamic<this>;
}
