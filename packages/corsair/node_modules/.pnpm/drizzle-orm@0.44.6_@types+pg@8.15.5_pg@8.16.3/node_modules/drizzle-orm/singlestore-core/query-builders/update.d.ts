import type { GetColumnData } from "../../column.js";
import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import type { SingleStoreDialect } from "../dialect.js";
import type { AnySingleStoreQueryResultHKT, PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStoreQueryResultHKT, SingleStoreQueryResultKind, SingleStoreSession } from "../session.js";
import type { SingleStoreTable } from "../table.js";
import type { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.js";
import type { Subquery } from "../../subquery.js";
import { type UpdateSet, type ValueOrArray } from "../../utils.js";
import type { SingleStoreColumn } from "../columns/common.js";
import type { SelectedFieldsOrdered } from "./select.types.js";
export interface SingleStoreUpdateConfig {
    where?: SQL | undefined;
    limit?: number | Placeholder;
    orderBy?: (SingleStoreColumn | SQL | SQL.Aliased)[];
    set: UpdateSet;
    table: SingleStoreTable;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type SingleStoreUpdateSetSource<TTable extends SingleStoreTable> = {
    [Key in keyof TTable['$inferInsert']]?: GetColumnData<TTable['_']['columns'][Key], 'query'> | SQL | undefined;
} & {};
export declare class SingleStoreUpdateBuilder<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
    private table;
    private session;
    private dialect;
    private withList?;
    static readonly [entityKind]: string;
    readonly _: {
        readonly table: TTable;
    };
    constructor(table: TTable, session: SingleStoreSession, dialect: SingleStoreDialect, withList?: Subquery[] | undefined);
    set(values: SingleStoreUpdateSetSource<TTable>): SingleStoreUpdateBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
export type SingleStoreUpdateWithout<T extends AnySingleStoreUpdateBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SingleStoreUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type SingleStoreUpdatePrepare<T extends AnySingleStoreUpdateBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], SingleStorePreparedQueryConfig & {
    execute: SingleStoreQueryResultKind<T['_']['queryResult'], never>;
    iterator: never;
}, true>;
export type SingleStoreUpdateDynamic<T extends AnySingleStoreUpdateBase> = SingleStoreUpdate<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT']>;
export type SingleStoreUpdate<TTable extends SingleStoreTable = SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT = AnySingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase> = SingleStoreUpdateBase<TTable, TQueryResult, TPreparedQueryHKT, true, never>;
export type AnySingleStoreUpdateBase = SingleStoreUpdateBase<any, any, any, any, any>;
export interface SingleStoreUpdateBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<SingleStoreQueryResultKind<TQueryResult, never>>, SQLWrapper {
    readonly _: {
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
    };
}
export declare class SingleStoreUpdateBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<SingleStoreQueryResultKind<TQueryResult, never>> implements SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    constructor(table: TTable, set: UpdateSet, session: SingleStoreSession, dialect: SingleStoreDialect, withList?: Subquery[]);
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
    where(where: SQL | undefined): SingleStoreUpdateWithout<this, TDynamic, 'where'>;
    orderBy(builder: (updateTable: TTable) => ValueOrArray<SingleStoreColumn | SQL | SQL.Aliased>): SingleStoreUpdateWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (SingleStoreColumn | SQL | SQL.Aliased)[]): SingleStoreUpdateWithout<this, TDynamic, 'orderBy'>;
    limit(limit: number | Placeholder): SingleStoreUpdateWithout<this, TDynamic, 'limit'>;
    toSQL(): Query;
    prepare(): SingleStoreUpdatePrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
    $dynamic(): SingleStoreUpdateDynamic<this>;
}
