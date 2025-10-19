import { entityKind } from "../../entity.cjs";
import type { GelDialect } from "../dialect.cjs";
import type { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.cjs";
import type { GelTable } from "../table.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { Subquery } from "../../subquery.cjs";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
export type GelDeleteWithout<T extends AnyGelDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<GelDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type GelDelete<TTable extends GelTable = GelTable, TQueryResult extends GelQueryResultHKT = GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = GelDeleteBase<TTable, TQueryResult, TReturning, true, never>;
export interface GelDeleteConfig {
    where?: SQL | undefined;
    table: GelTable;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type GelDeleteReturningAll<T extends AnyGelDeleteBase, TDynamic extends boolean> = GelDeleteWithout<GelDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type GelDeleteReturning<T extends AnyGelDeleteBase, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = GelDeleteWithout<GelDeleteBase<T['_']['table'], T['_']['queryResult'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type GelDeletePrepare<T extends AnyGelDeleteBase> = GelPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? GelQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type GelDeleteDynamic<T extends AnyGelDeleteBase> = GelDelete<T['_']['table'], T['_']['queryResult'], T['_']['returning']>;
export type AnyGelDeleteBase = GelDeleteBase<any, any, any, any, any>;
export interface GelDeleteBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    readonly _: {
        dialect: 'gel';
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export declare class GelDeleteBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    constructor(table: TTable, session: GelSession, dialect: GelDialect, withList?: Subquery[]);
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
    where(where: SQL | undefined): GelDeleteWithout<this, TDynamic, 'where'>;
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
    returning(): GelDeleteReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): GelDeleteReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(name: string): GelDeletePrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): GelDeleteDynamic<this>;
}
