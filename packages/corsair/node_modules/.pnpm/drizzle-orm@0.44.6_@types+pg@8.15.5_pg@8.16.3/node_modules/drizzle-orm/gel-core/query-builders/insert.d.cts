import { entityKind } from "../../entity.cjs";
import type { GelDialect } from "../dialect.cjs";
import type { IndexColumn } from "../indexes.cjs";
import type { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.cjs";
import type { GelTable, TableConfig } from "../table.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { SelectResultFields } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Placeholder, Query, SQLWrapper } from "../../sql/sql.cjs";
import { Param, SQL } from "../../sql/sql.cjs";
import type { Subquery } from "../../subquery.cjs";
import type { InferInsertModel } from "../../table.cjs";
import type { AnyGelColumn } from "../columns/common.cjs";
import { QueryBuilder } from "./query-builder.cjs";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.cjs";
import type { GelUpdateSetSource } from "./update.cjs";
export interface GelInsertConfig<TTable extends GelTable = GelTable> {
    table: TTable;
    values: Record<string, Param | SQL>[] | GelInsertSelectQueryBuilder<TTable> | SQL;
    withList?: Subquery[];
    onConflict?: SQL;
    returning?: SelectedFieldsOrdered;
    select?: boolean;
    overridingSystemValue_?: boolean;
}
export type GelInsertValue<TTable extends GelTable<TableConfig>, OverrideT extends boolean = false> = {
    [Key in keyof InferInsertModel<TTable, {
        dbColumnNames: false;
        override: OverrideT;
    }>]: InferInsertModel<TTable, {
        dbColumnNames: false;
        override: OverrideT;
    }>[Key] | SQL | Placeholder;
} & {};
export type GelInsertSelectQueryBuilder<TTable extends GelTable> = TypedQueryBuilder<{
    [K in keyof TTable['$inferInsert']]: AnyGelColumn | SQL | SQL.Aliased | TTable['$inferInsert'][K];
}>;
export declare class GelInsertBuilder<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, OverrideT extends boolean = false> {
    private table;
    private session;
    private dialect;
    private withList?;
    private overridingSystemValue_?;
    static readonly [entityKind]: string;
    constructor(table: TTable, session: GelSession, dialect: GelDialect, withList?: Subquery[] | undefined, overridingSystemValue_?: boolean | undefined);
    private authToken?;
    overridingSystemValue(): Omit<GelInsertBuilder<TTable, TQueryResult, true>, 'overridingSystemValue'>;
    values(value: GelInsertValue<TTable, OverrideT>): GelInsertBase<TTable, TQueryResult>;
    values(values: GelInsertValue<TTable, OverrideT>[]): GelInsertBase<TTable, TQueryResult>;
    select(selectQuery: (qb: QueryBuilder) => GelInsertSelectQueryBuilder<TTable>): GelInsertBase<TTable, TQueryResult>;
    select(selectQuery: (qb: QueryBuilder) => SQL): GelInsertBase<TTable, TQueryResult>;
    select(selectQuery: SQL): GelInsertBase<TTable, TQueryResult>;
    select(selectQuery: GelInsertSelectQueryBuilder<TTable>): GelInsertBase<TTable, TQueryResult>;
}
export type GelInsertWithout<T extends AnyGelInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<GelInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type GelInsertReturning<T extends AnyGelInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = GelInsertBase<T['_']['table'], T['_']['queryResult'], SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>;
export type GelInsertReturningAll<T extends AnyGelInsert, TDynamic extends boolean> = GelInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>;
export interface GelInsertOnConflictDoUpdateConfig<T extends AnyGelInsert> {
    target: IndexColumn | IndexColumn[];
    /** @deprecated use either `targetWhere` or `setWhere` */
    where?: SQL;
    targetWhere?: SQL;
    setWhere?: SQL;
    set: GelUpdateSetSource<T['_']['table']>;
}
export type GelInsertPrepare<T extends AnyGelInsert> = GelPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? GelQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type GelInsertDynamic<T extends AnyGelInsert> = GelInsert<T['_']['table'], T['_']['queryResult'], T['_']['returning']>;
export type AnyGelInsert = GelInsertBase<any, any, any, any, any>;
export type GelInsert<TTable extends GelTable = GelTable, TQueryResult extends GelQueryResultHKT = GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = GelInsertBase<TTable, TQueryResult, TReturning, true, never>;
export interface GelInsertBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'gel';
        readonly table: TTable;
        readonly queryResult: TQueryResult;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export declare class GelInsertBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    constructor(table: TTable, values: GelInsertConfig['values'], session: GelSession, dialect: GelDialect, withList?: Subquery[], select?: boolean, overridingSystemValue_?: boolean);
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
    returning(): GelInsertWithout<GelInsertReturningAll<this, TDynamic>, TDynamic, 'returning'>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): GelInsertWithout<GelInsertReturning<this, TDynamic, TSelectedFields>, TDynamic, 'returning'>;
    toSQL(): Query;
    prepare(name: string): GelInsertPrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): GelInsertDynamic<this>;
}
