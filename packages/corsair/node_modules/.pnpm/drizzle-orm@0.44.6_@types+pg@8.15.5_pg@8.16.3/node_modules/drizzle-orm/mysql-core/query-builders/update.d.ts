import type { WithCacheConfig } from "../../cache/core/types.js";
import type { GetColumnData } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { MySqlDialect } from "../dialect.js";
import type { AnyMySqlQueryResultHKT, MySqlPreparedQueryConfig, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.js";
import type { MySqlTable } from "../table.js";
import { QueryPromise } from "../../query-promise.js";
import type { Placeholder, Query, SQL, SQLWrapper } from "../../sql/sql.js";
import type { Subquery } from "../../subquery.js";
import { type UpdateSet, type ValueOrArray } from "../../utils.js";
import type { MySqlColumn } from "../columns/common.js";
import type { SelectedFieldsOrdered } from "./select.types.js";
export interface MySqlUpdateConfig {
    where?: SQL | undefined;
    limit?: number | Placeholder;
    orderBy?: (MySqlColumn | SQL | SQL.Aliased)[];
    set: UpdateSet;
    table: MySqlTable;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type MySqlUpdateSetSource<TTable extends MySqlTable> = {
    [Key in keyof TTable['$inferInsert']]?: GetColumnData<TTable['_']['columns'][Key], 'query'> | SQL | undefined;
} & {};
export declare class MySqlUpdateBuilder<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
    private table;
    private session;
    private dialect;
    private withList?;
    static readonly [entityKind]: string;
    readonly _: {
        readonly table: TTable;
    };
    constructor(table: TTable, session: MySqlSession, dialect: MySqlDialect, withList?: Subquery[] | undefined);
    set(values: MySqlUpdateSetSource<TTable>): MySqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
export type MySqlUpdateWithout<T extends AnyMySqlUpdateBase, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<MySqlUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type MySqlUpdatePrepare<T extends AnyMySqlUpdateBase> = PreparedQueryKind<T['_']['preparedQueryHKT'], MySqlPreparedQueryConfig & {
    execute: MySqlQueryResultKind<T['_']['queryResult'], never>;
    iterator: never;
}, true>;
export type MySqlUpdateDynamic<T extends AnyMySqlUpdateBase> = MySqlUpdate<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT']>;
export type MySqlUpdate<TTable extends MySqlTable = MySqlTable, TQueryResult extends MySqlQueryResultHKT = AnyMySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase> = MySqlUpdateBase<TTable, TQueryResult, TPreparedQueryHKT, true, never>;
export type AnyMySqlUpdateBase = MySqlUpdateBase<any, any, any, any, any>;
export interface MySqlUpdateBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<MySqlQueryResultKind<TQueryResult, never>>, SQLWrapper {
    readonly _: {
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
    };
}
export declare class MySqlUpdateBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<MySqlQueryResultKind<TQueryResult, never>> implements SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    protected cacheConfig?: WithCacheConfig;
    constructor(table: TTable, set: UpdateSet, session: MySqlSession, dialect: MySqlDialect, withList?: Subquery[]);
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
    where(where: SQL | undefined): MySqlUpdateWithout<this, TDynamic, 'where'>;
    orderBy(builder: (updateTable: TTable) => ValueOrArray<MySqlColumn | SQL | SQL.Aliased>): MySqlUpdateWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (MySqlColumn | SQL | SQL.Aliased)[]): MySqlUpdateWithout<this, TDynamic, 'orderBy'>;
    limit(limit: number | Placeholder): MySqlUpdateWithout<this, TDynamic, 'limit'>;
    toSQL(): Query;
    prepare(): MySqlUpdatePrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
    $dynamic(): MySqlUpdateDynamic<this>;
}
