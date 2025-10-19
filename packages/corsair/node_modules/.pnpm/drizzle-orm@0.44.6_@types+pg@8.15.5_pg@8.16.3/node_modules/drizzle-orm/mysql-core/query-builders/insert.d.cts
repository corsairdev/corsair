import type { WithCacheConfig } from "../../cache/core/types.cjs";
import { entityKind } from "../../entity.cjs";
import type { MySqlDialect } from "../dialect.cjs";
import type { AnyMySqlQueryResultHKT, MySqlPreparedQueryConfig, MySqlQueryResultHKT, MySqlQueryResultKind, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.cjs";
import type { MySqlTable } from "../table.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Placeholder, Query, SQLWrapper } from "../../sql/sql.cjs";
import { Param, SQL } from "../../sql/sql.cjs";
import type { InferModelFromColumns } from "../../table.cjs";
import type { AnyMySqlColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import type { SelectedFieldsOrdered } from "./select.types.cjs";
import type { MySqlUpdateSetSource } from "./update.cjs";
export interface MySqlInsertConfig<TTable extends MySqlTable = MySqlTable> {
    table: TTable;
    values: Record<string, Param | SQL>[] | MySqlInsertSelectQueryBuilder<TTable> | SQL;
    ignore: boolean;
    onConflict?: SQL;
    returning?: SelectedFieldsOrdered;
    select?: boolean;
}
export type AnyMySqlInsertConfig = MySqlInsertConfig<MySqlTable>;
export type MySqlInsertValue<TTable extends MySqlTable> = {
    [Key in keyof TTable['$inferInsert']]: TTable['$inferInsert'][Key] | SQL | Placeholder;
} & {};
export type MySqlInsertSelectQueryBuilder<TTable extends MySqlTable> = TypedQueryBuilder<{
    [K in keyof TTable['$inferInsert']]: AnyMySqlColumn | SQL | SQL.Aliased | TTable['$inferInsert'][K];
}>;
export declare class MySqlInsertBuilder<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
    private table;
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private shouldIgnore;
    constructor(table: TTable, session: MySqlSession, dialect: MySqlDialect);
    ignore(): this;
    values(value: MySqlInsertValue<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    values(values: MySqlInsertValue<TTable>[]): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    select(selectQuery: (qb: QueryBuilder) => MySqlInsertSelectQueryBuilder<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    select(selectQuery: (qb: QueryBuilder) => SQL): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    select(selectQuery: SQL): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    select(selectQuery: MySqlInsertSelectQueryBuilder<TTable>): MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
export type MySqlInsertWithout<T extends AnyMySqlInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<MySqlInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | '$returning'>, T['_']['excludedMethods'] | K>;
export type MySqlInsertDynamic<T extends AnyMySqlInsert> = MySqlInsert<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning']>;
export type MySqlInsertPrepare<T extends AnyMySqlInsert, TReturning extends Record<string, unknown> | undefined = undefined> = PreparedQueryKind<T['_']['preparedQueryHKT'], MySqlPreparedQueryConfig & {
    execute: TReturning extends undefined ? MySqlQueryResultKind<T['_']['queryResult'], never> : TReturning[];
    iterator: never;
}, true>;
export type MySqlInsertOnDuplicateKeyUpdateConfig<T extends AnyMySqlInsert> = {
    set: MySqlUpdateSetSource<T['_']['table']>;
};
export type MySqlInsert<TTable extends MySqlTable = MySqlTable, TQueryResult extends MySqlQueryResultHKT = AnyMySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = MySqlInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TReturning, true, never>;
export type MySqlInsertReturning<T extends AnyMySqlInsert, TDynamic extends boolean> = MySqlInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], InferModelFromColumns<GetPrimarySerialOrDefaultKeys<T['_']['table']['_']['columns']>>, TDynamic, T['_']['excludedMethods'] | '$returning'>;
export type AnyMySqlInsert = MySqlInsertBase<any, any, any, any, any, any>;
export interface MySqlInsertBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[], 'mysql'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'mysql';
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly returning: TReturning;
        readonly result: TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export type PrimaryKeyKeys<T extends Record<string, AnyMySqlColumn>> = {
    [K in keyof T]: T[K]['_']['isPrimaryKey'] extends true ? T[K]['_']['isAutoincrement'] extends true ? K : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never;
}[keyof T];
export type GetPrimarySerialOrDefaultKeys<T extends Record<string, AnyMySqlColumn>> = {
    [K in PrimaryKeyKeys<T>]: T[K];
};
export declare class MySqlInsertBase<TTable extends MySqlTable, TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? MySqlQueryResultKind<TQueryResult, never> : TReturning[], 'mysql'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    protected $table: TTable;
    private config;
    protected cacheConfig?: WithCacheConfig;
    constructor(table: TTable, values: MySqlInsertConfig['values'], ignore: boolean, session: MySqlSession, dialect: MySqlDialect, select?: boolean);
    /**
     * Adds an `on duplicate key update` clause to the query.
     *
     * Calling this method will update the row if any unique index conflicts. MySQL will automatically determine the conflict target based on the primary key and unique indexes.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#on-duplicate-key-update}
     *
     * @param config The `set` clause
     *
     * @example
     * ```ts
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW'})
     *   .onDuplicateKeyUpdate({ set: { brand: 'Porsche' }});
     * ```
     *
     * While MySQL does not directly support doing nothing on conflict, you can perform a no-op by setting any column's value to itself and achieve the same effect:
     *
     * ```ts
     * import { sql } from 'drizzle-orm';
     *
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onDuplicateKeyUpdate({ set: { id: sql`id` } });
     * ```
     */
    onDuplicateKeyUpdate(config: MySqlInsertOnDuplicateKeyUpdateConfig<this>): MySqlInsertWithout<this, TDynamic, 'onDuplicateKeyUpdate'>;
    $returningId(): MySqlInsertWithout<MySqlInsertReturning<this, TDynamic>, TDynamic, '$returningId'>;
    toSQL(): Query;
    prepare(): MySqlInsertPrepare<this, TReturning>;
    execute: ReturnType<this['prepare']>['execute'];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
    $dynamic(): MySqlInsertDynamic<this>;
}
