import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { SingleStoreDialect } from "../dialect.js";
import type { AnySingleStoreQueryResultHKT, PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStoreQueryResultHKT, SingleStoreQueryResultKind, SingleStoreSession } from "../session.js";
import type { SingleStoreTable } from "../table.js";
import type { Placeholder, Query, SQLWrapper } from "../../sql/sql.js";
import { Param, SQL } from "../../sql/sql.js";
import type { InferModelFromColumns } from "../../table.js";
import type { AnySingleStoreColumn } from "../columns/common.js";
import type { SelectedFieldsOrdered } from "./select.types.js";
import type { SingleStoreUpdateSetSource } from "./update.js";
export interface SingleStoreInsertConfig<TTable extends SingleStoreTable = SingleStoreTable> {
    table: TTable;
    values: Record<string, Param | SQL>[];
    ignore: boolean;
    onConflict?: SQL;
    returning?: SelectedFieldsOrdered;
}
export type AnySingleStoreInsertConfig = SingleStoreInsertConfig<SingleStoreTable>;
export type SingleStoreInsertValue<TTable extends SingleStoreTable> = {
    [Key in keyof TTable['$inferInsert']]: TTable['$inferInsert'][Key] | SQL | Placeholder;
} & {};
export declare class SingleStoreInsertBuilder<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase> {
    private table;
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private shouldIgnore;
    constructor(table: TTable, session: SingleStoreSession, dialect: SingleStoreDialect);
    ignore(): this;
    values(value: SingleStoreInsertValue<TTable>): SingleStoreInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
    values(values: SingleStoreInsertValue<TTable>[]): SingleStoreInsertBase<TTable, TQueryResult, TPreparedQueryHKT>;
}
export type SingleStoreInsertWithout<T extends AnySingleStoreInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<SingleStoreInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | '$returning'>, T['_']['excludedMethods'] | K>;
export type SingleStoreInsertDynamic<T extends AnySingleStoreInsert> = SingleStoreInsert<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], T['_']['returning']>;
export type SingleStoreInsertPrepare<T extends AnySingleStoreInsert, TReturning extends Record<string, unknown> | undefined = undefined> = PreparedQueryKind<T['_']['preparedQueryHKT'], SingleStorePreparedQueryConfig & {
    execute: TReturning extends undefined ? SingleStoreQueryResultKind<T['_']['queryResult'], never> : TReturning[];
    iterator: never;
}, true>;
export type SingleStoreInsertOnDuplicateKeyUpdateConfig<T extends AnySingleStoreInsert> = {
    set: SingleStoreUpdateSetSource<T['_']['table']>;
};
export type SingleStoreInsert<TTable extends SingleStoreTable = SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT = AnySingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = SingleStoreInsertBase<TTable, TQueryResult, TPreparedQueryHKT, TReturning, true, never>;
export type SingleStoreInsertReturning<T extends AnySingleStoreInsert, TDynamic extends boolean> = SingleStoreInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['preparedQueryHKT'], InferModelFromColumns<GetPrimarySerialOrDefaultKeys<T['_']['table']['_']['columns']>>, TDynamic, T['_']['excludedMethods'] | '$returning'>;
export type AnySingleStoreInsert = SingleStoreInsertBase<any, any, any, any, any, any>;
export interface SingleStoreInsertBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? SingleStoreQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? SingleStoreQueryResultKind<TQueryResult, never> : TReturning[], 'singlestore'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'singlestore';
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly returning: TReturning;
        readonly result: TReturning extends undefined ? SingleStoreQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export type PrimaryKeyKeys<T extends Record<string, AnySingleStoreColumn>> = {
    [K in keyof T]: T[K]['_']['isPrimaryKey'] extends true ? T[K]['_']['isAutoincrement'] extends true ? K : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never : T[K]['_']['hasRuntimeDefault'] extends true ? T[K]['_']['isPrimaryKey'] extends true ? K : never : never;
}[keyof T];
export type GetPrimarySerialOrDefaultKeys<T extends Record<string, AnySingleStoreColumn>> = {
    [K in PrimaryKeyKeys<T>]: T[K];
};
export declare class SingleStoreInsertBase<TTable extends SingleStoreTable, TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? SingleStoreQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? SingleStoreQueryResultKind<TQueryResult, never> : TReturning[], 'singlestore'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    protected $table: TTable;
    private config;
    constructor(table: TTable, values: SingleStoreInsertConfig['values'], ignore: boolean, session: SingleStoreSession, dialect: SingleStoreDialect);
    /**
     * Adds an `on duplicate key update` clause to the query.
     *
     * Calling this method will update update the row if any unique index conflicts. MySQL will automatically determine the conflict target based on the primary key and unique indexes.
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
    onDuplicateKeyUpdate(config: SingleStoreInsertOnDuplicateKeyUpdateConfig<this>): SingleStoreInsertWithout<this, TDynamic, 'onDuplicateKeyUpdate'>;
    $returningId(): SingleStoreInsertWithout<SingleStoreInsertReturning<this, TDynamic>, TDynamic, '$returningId'>;
    toSQL(): Query;
    prepare(): SingleStoreInsertPrepare<this, TReturning>;
    execute: ReturnType<this['prepare']>['execute'];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
    $dynamic(): SingleStoreInsertDynamic<this>;
}
