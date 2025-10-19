import { entityKind } from "../../entity.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { SingleStoreDialect } from "../dialect.cjs";
import type { AnySingleStoreQueryResultHKT, PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStoreQueryResultHKT, SingleStoreQueryResultKind, SingleStoreSession } from "../session.cjs";
import type { SingleStoreTable } from "../table.cjs";
import type { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { Subquery } from "../../subquery.cjs";
import type { ValueOrArray } from "../../utils.cjs";
import type { SingleStoreColumn } from "../columns/common.cjs";
import type { SelectedFieldsOrdered } from "./select.types.cjs";
export type SingleStoreDeleteWithout<T extends AnySingleStoreDeleteBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SingleStoreDeleteBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type SingleStoreDelete<TTable extends SingleStoreTable = SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT = AnySingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase> = SingleStoreDeleteBase<TTable, TQueryResult, TPreparedQueryHKT, true, never>;
export interface SingleStoreDeleteConfig {
    where?: SQL | undefined;
    limit?: number | Placeholder;
    orderBy?: (SingleStoreColumn | SQL | SQL.Aliased)[];
    table: SingleStoreTable;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type SingleStoreDeletePrepare<T extends AnySingleStoreDeleteBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], SingleStorePreparedQueryConfig & {
    execute: SingleStoreQueryResultKind<T['_']['queryResult'], never>;
    iterator: never;
}, true>;
type SingleStoreDeleteDynamic<T extends AnySingleStoreDeleteBase> = SingleStoreDelete<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT']>;
type AnySingleStoreDeleteBase = SingleStoreDeleteBase<any, any, any, any, any>;
export interface SingleStoreDeleteBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<SingleStoreQueryResultKind<TQueryResult, never>> {
    readonly _: {
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
    };
}
export declare class SingleStoreDeleteBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<SingleStoreQueryResultKind<TQueryResult, never>> implements SQLWrapper {
    private table;
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    constructor(table: TTable, session: SingleStoreSession, dialect: SingleStoreDialect, withList?: Subquery[]);
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
    where(where: SQL | undefined): SingleStoreDeleteWithout<this, TDynamic, 'where'>;
    orderBy(builder: (deleteTable: TTable) => ValueOrArray<SingleStoreColumn | SQL | SQL.Aliased>): SingleStoreDeleteWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (SingleStoreColumn | SQL | SQL.Aliased)[]): SingleStoreDeleteWithout<this, TDynamic, 'orderBy'>;
    limit(limit: number | Placeholder): SingleStoreDeleteWithout<this, TDynamic, 'limit'>;
    toSQL(): Query;
    prepare(): SingleStoreDeletePrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
    $dynamic(): SingleStoreDeleteDynamic<this>;
}
export {};
