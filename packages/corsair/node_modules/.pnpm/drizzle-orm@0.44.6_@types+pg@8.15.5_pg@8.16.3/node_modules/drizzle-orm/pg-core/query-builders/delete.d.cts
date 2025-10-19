import type { WithCacheConfig } from "../../cache/core/types.cjs";
import { entityKind } from "../../entity.cjs";
import type { PgDialect } from "../dialect.cjs";
import type { PgPreparedQuery, PgQueryResultHKT, PgQueryResultKind, PgSession, PreparedQueryConfig } from "../session.cjs";
import type { PgTable } from "../table.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { ColumnsSelection, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { Subquery } from "../../subquery.cjs";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
export type PgDeleteWithout<T extends AnyPgDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<PgDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type PgDelete<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgDeleteBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
export interface PgDeleteConfig {
    where?: SQL | undefined;
    table: PgTable;
    returningFields?: SelectedFieldsFlat;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type PgDeleteReturningAll<T extends AnyPgDeleteBase, TDynamic extends boolean> = PgDeleteWithout<PgDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['_']['columns'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type PgDeleteReturning<T extends AnyPgDeleteBase, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = PgDeleteWithout<PgDeleteBase<T['_']['table'], T['_']['queryResult'], TSelectedFields, SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type PgDeletePrepare<T extends AnyPgDeleteBase> = PgPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type PgDeleteDynamic<T extends AnyPgDeleteBase> = PgDelete<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning']>;
export type AnyPgDeleteBase = PgDeleteBase<any, any, any, any, any, any>;
export interface PgDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'pg';
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly selectedFields: TSelectedFields;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export declare class PgDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    protected cacheConfig?: WithCacheConfig;
    constructor(table: TTable, session: PgSession, dialect: PgDialect, withList?: Subquery[]);
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
     * await db.delete(cars).where(eq(cars.color, 'green'));
     * // or
     * await db.delete(cars).where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Delete all BMW cars with a green color
     * await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Delete all cars with the green or blue color
     * await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where: SQL | undefined): PgDeleteWithout<this, TDynamic, 'where'>;
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
    returning(): PgDeleteReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): PgDeleteReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(name: string): PgDeletePrepare<this>;
    private authToken?;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): PgDeleteDynamic<this>;
}
