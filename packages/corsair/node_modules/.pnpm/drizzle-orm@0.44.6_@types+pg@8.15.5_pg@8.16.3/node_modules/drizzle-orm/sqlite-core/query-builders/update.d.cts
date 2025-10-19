import type { GetColumnData } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { SQLiteDialect } from "../dialect.cjs";
import type { SQLitePreparedQuery, SQLiteSession } from "../session.cjs";
import { SQLiteTable } from "../table.cjs";
import { Subquery } from "../../subquery.cjs";
import { type DrizzleTypeError, type UpdateSet, type ValueOrArray } from "../../utils.cjs";
import type { SQLiteColumn } from "../columns/common.cjs";
import { SQLiteViewBase } from "../view-base.cjs";
import type { SelectedFields, SelectedFieldsOrdered, SQLiteSelectJoinConfig } from "./select.types.cjs";
export interface SQLiteUpdateConfig {
    where?: SQL | undefined;
    limit?: number | Placeholder;
    orderBy?: (SQLiteColumn | SQL | SQL.Aliased)[];
    set: UpdateSet;
    table: SQLiteTable;
    from?: SQLiteTable | Subquery | SQLiteViewBase | SQL;
    joins: SQLiteSelectJoinConfig[];
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type SQLiteUpdateSetSource<TTable extends SQLiteTable> = {
    [Key in keyof TTable['$inferInsert']]?: GetColumnData<TTable['_']['columns'][Key], 'query'> | SQL | SQLiteColumn | undefined;
} & {};
export declare class SQLiteUpdateBuilder<TTable extends SQLiteTable, TResultType extends 'sync' | 'async', TRunResult> {
    protected table: TTable;
    protected session: SQLiteSession<any, any, any, any>;
    protected dialect: SQLiteDialect;
    private withList?;
    static readonly [entityKind]: string;
    readonly _: {
        readonly table: TTable;
    };
    constructor(table: TTable, session: SQLiteSession<any, any, any, any>, dialect: SQLiteDialect, withList?: Subquery[] | undefined);
    set(values: SQLiteUpdateSetSource<TTable>): SQLiteUpdateWithout<SQLiteUpdateBase<TTable, TResultType, TRunResult>, false, 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>;
}
export type SQLiteUpdateWithout<T extends AnySQLiteUpdate, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SQLiteUpdateBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['from'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type SQLiteUpdateWithJoins<T extends AnySQLiteUpdate, TDynamic extends boolean, TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL> = TDynamic extends true ? T : Omit<SQLiteUpdateBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], TFrom, T['_']['returning'], TDynamic, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>;
export type SQLiteUpdateReturningAll<T extends AnySQLiteUpdate, TDynamic extends boolean> = SQLiteUpdateWithout<SQLiteUpdateBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['from'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteUpdateReturning<T extends AnySQLiteUpdate, TDynamic extends boolean, TSelectedFields extends SelectedFields> = SQLiteUpdateWithout<SQLiteUpdateBase<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['from'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type SQLiteUpdateExecute<T extends AnySQLiteUpdate> = T['_']['returning'] extends undefined ? T['_']['runResult'] : T['_']['returning'][];
export type SQLiteUpdatePrepare<T extends AnySQLiteUpdate> = SQLitePreparedQuery<{
    type: T['_']['resultType'];
    run: T['_']['runResult'];
    all: T['_']['returning'] extends undefined ? DrizzleTypeError<'.all() cannot be used without .returning()'> : T['_']['returning'][];
    get: T['_']['returning'] extends undefined ? DrizzleTypeError<'.get() cannot be used without .returning()'> : T['_']['returning'];
    values: T['_']['returning'] extends undefined ? DrizzleTypeError<'.values() cannot be used without .returning()'> : any[][];
    execute: SQLiteUpdateExecute<T>;
}>;
export type SQLiteUpdateJoinFn<T extends AnySQLiteUpdate> = <TJoinedTable extends SQLiteTable | Subquery | SQLiteViewBase | SQL>(table: TJoinedTable, on: ((updateTable: T['_']['table']['_']['columns'], from: T['_']['from'] extends SQLiteTable ? T['_']['from']['_']['columns'] : T['_']['from'] extends Subquery | SQLiteViewBase ? T['_']['from']['_']['selectedFields'] : never) => SQL | undefined) | SQL | undefined) => T;
export type SQLiteUpdateDynamic<T extends AnySQLiteUpdate> = SQLiteUpdate<T['_']['table'], T['_']['resultType'], T['_']['runResult'], T['_']['returning']>;
export type SQLiteUpdate<TTable extends SQLiteTable = SQLiteTable, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = any, TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = SQLiteUpdateBase<TTable, TResultType, TRunResult, TFrom, TReturning, true, never>;
export type AnySQLiteUpdate = SQLiteUpdateBase<any, any, any, any, any, any, any>;
export interface SQLiteUpdateBase<TTable extends SQLiteTable = SQLiteTable, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL | undefined = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends SQLWrapper, QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]> {
    readonly _: {
        readonly dialect: 'sqlite';
        readonly table: TTable;
        readonly resultType: TResultType;
        readonly runResult: TRunResult;
        readonly from: TFrom;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? TRunResult : TReturning[];
    };
}
export declare class SQLiteUpdateBase<TTable extends SQLiteTable = SQLiteTable, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL | undefined = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? TRunResult : TReturning[]> implements RunnableQuery<TReturning extends undefined ? TRunResult : TReturning[], 'sqlite'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    constructor(table: TTable, set: UpdateSet, session: SQLiteSession<any, any, any, any>, dialect: SQLiteDialect, withList?: Subquery[]);
    from<TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL>(source: TFrom): SQLiteUpdateWithJoins<this, TDynamic, TFrom>;
    private createJoin;
    leftJoin: SQLiteUpdateJoinFn<this>;
    rightJoin: SQLiteUpdateJoinFn<this>;
    innerJoin: SQLiteUpdateJoinFn<this>;
    fullJoin: SQLiteUpdateJoinFn<this>;
    /**
     * Adds a 'where' clause to the query.
     *
     * Calling this method will update only those rows that fulfill a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/update}
     *
     * @param where the 'where' clause.
     *
     * @example
     * You can use conditional operators and `sql function` to filter the rows to be updated.
     *
     * ```ts
     * // Update all cars with green color
     * db.update(cars).set({ color: 'red' })
     *   .where(eq(cars.color, 'green'));
     * // or
     * db.update(cars).set({ color: 'red' })
     *   .where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Update all BMW cars with a green color
     * db.update(cars).set({ color: 'red' })
     *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Update all cars with the green or blue color
     * db.update(cars).set({ color: 'red' })
     *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where: SQL | undefined): SQLiteUpdateWithout<this, TDynamic, 'where'>;
    orderBy(builder: (updateTable: TTable) => ValueOrArray<SQLiteColumn | SQL | SQL.Aliased>): SQLiteUpdateWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (SQLiteColumn | SQL | SQL.Aliased)[]): SQLiteUpdateWithout<this, TDynamic, 'orderBy'>;
    limit(limit: number | Placeholder): SQLiteUpdateWithout<this, TDynamic, 'limit'>;
    /**
     * Adds a `returning` clause to the query.
     *
     * Calling this method will return the specified fields of the updated rows. If no fields are specified, all fields will be returned.
     *
     * See docs: {@link https://orm.drizzle.team/docs/update#update-with-returning}
     *
     * @example
     * ```ts
     * // Update all cars with the green color and return all fields
     * const updatedCars: Car[] = await db.update(cars)
     *   .set({ color: 'red' })
     *   .where(eq(cars.color, 'green'))
     *   .returning();
     *
     * // Update all cars with the green color and return only their id and brand fields
     * const updatedCarsIdsAndBrands: { id: number, brand: string }[] = await db.update(cars)
     *   .set({ color: 'red' })
     *   .where(eq(cars.color, 'green'))
     *   .returning({ id: cars.id, brand: cars.brand });
     * ```
     */
    returning(): SQLiteUpdateReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFields>(fields: TSelectedFields): SQLiteUpdateReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(): SQLiteUpdatePrepare<this>;
    run: ReturnType<this['prepare']>['run'];
    all: ReturnType<this['prepare']>['all'];
    get: ReturnType<this['prepare']>['get'];
    values: ReturnType<this['prepare']>['values'];
    execute(): Promise<SQLiteUpdateExecute<this>>;
    $dynamic(): SQLiteUpdateDynamic<this>;
}
