import type { WithCacheConfig } from "../../cache/core/types.js";
import { entityKind } from "../../entity.js";
import type { PgDialect } from "../dialect.js";
import type { IndexColumn } from "../indexes.js";
import type { PgPreparedQuery, PgQueryResultHKT, PgQueryResultKind, PgSession, PreparedQueryConfig } from "../session.js";
import type { PgTable, TableConfig } from "../table.js";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import type { SelectResultFields } from "../../query-builders/select.types.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { ColumnsSelection, Placeholder, Query, SQLWrapper } from "../../sql/sql.js";
import { Param, SQL } from "../../sql/sql.js";
import type { Subquery } from "../../subquery.js";
import type { InferInsertModel } from "../../table.js";
import type { AnyPgColumn } from "../columns/common.js";
import { QueryBuilder } from "./query-builder.js";
import type { SelectedFieldsFlat, SelectedFieldsOrdered } from "./select.types.js";
import type { PgUpdateSetSource } from "./update.js";
export interface PgInsertConfig<TTable extends PgTable = PgTable> {
    table: TTable;
    values: Record<string, Param | SQL>[] | PgInsertSelectQueryBuilder<TTable> | SQL;
    withList?: Subquery[];
    onConflict?: SQL;
    returningFields?: SelectedFieldsFlat;
    returning?: SelectedFieldsOrdered;
    select?: boolean;
    overridingSystemValue_?: boolean;
}
export type PgInsertValue<TTable extends PgTable<TableConfig>, OverrideT extends boolean = false> = {
    [Key in keyof InferInsertModel<TTable, {
        dbColumnNames: false;
        override: OverrideT;
    }>]: InferInsertModel<TTable, {
        dbColumnNames: false;
        override: OverrideT;
    }>[Key] | SQL | Placeholder;
} & {};
export type PgInsertSelectQueryBuilder<TTable extends PgTable> = TypedQueryBuilder<{
    [K in keyof TTable['$inferInsert']]: AnyPgColumn | SQL | SQL.Aliased | TTable['$inferInsert'][K];
}>;
export declare class PgInsertBuilder<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, OverrideT extends boolean = false> {
    private table;
    private session;
    private dialect;
    private withList?;
    private overridingSystemValue_?;
    static readonly [entityKind]: string;
    constructor(table: TTable, session: PgSession, dialect: PgDialect, withList?: Subquery[] | undefined, overridingSystemValue_?: boolean | undefined);
    private authToken?;
    overridingSystemValue(): Omit<PgInsertBuilder<TTable, TQueryResult, true>, 'overridingSystemValue'>;
    values(value: PgInsertValue<TTable, OverrideT>): PgInsertBase<TTable, TQueryResult>;
    values(values: PgInsertValue<TTable, OverrideT>[]): PgInsertBase<TTable, TQueryResult>;
    select(selectQuery: (qb: QueryBuilder) => PgInsertSelectQueryBuilder<TTable>): PgInsertBase<TTable, TQueryResult>;
    select(selectQuery: (qb: QueryBuilder) => SQL): PgInsertBase<TTable, TQueryResult>;
    select(selectQuery: SQL): PgInsertBase<TTable, TQueryResult>;
    select(selectQuery: PgInsertSelectQueryBuilder<TTable>): PgInsertBase<TTable, TQueryResult>;
}
export type PgInsertWithout<T extends AnyPgInsert, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<PgInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['selectedFields'], T['_']['returning'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type PgInsertReturning<T extends AnyPgInsert, TDynamic extends boolean, TSelectedFields extends SelectedFieldsFlat> = PgInsertBase<T['_']['table'], T['_']['queryResult'], TSelectedFields, SelectResultFields<TSelectedFields>, TDynamic, T['_']['excludedMethods']>;
export type PgInsertReturningAll<T extends AnyPgInsert, TDynamic extends boolean> = PgInsertBase<T['_']['table'], T['_']['queryResult'], T['_']['table']['_']['columns'], T['_']['table']['$inferSelect'], TDynamic, T['_']['excludedMethods']>;
export interface PgInsertOnConflictDoUpdateConfig<T extends AnyPgInsert> {
    target: IndexColumn | IndexColumn[];
    /** @deprecated use either `targetWhere` or `setWhere` */
    where?: SQL;
    targetWhere?: SQL;
    setWhere?: SQL;
    set: PgUpdateSetSource<T['_']['table']>;
}
export type PgInsertPrepare<T extends AnyPgInsert> = PgPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type PgInsertDynamic<T extends AnyPgInsert> = PgInsert<T['_']['table'], T['_']['queryResult'], T['_']['returning']>;
export type AnyPgInsert = PgInsertBase<any, any, any, any, any, any>;
export type PgInsert<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = ColumnsSelection | undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgInsertBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
export interface PgInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
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
export declare class PgInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    protected cacheConfig?: WithCacheConfig;
    constructor(table: TTable, values: PgInsertConfig['values'], session: PgSession, dialect: PgDialect, withList?: Subquery[], select?: boolean, overridingSystemValue_?: boolean);
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
    returning(): PgInsertWithout<PgInsertReturningAll<this, TDynamic>, TDynamic, 'returning'>;
    returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): PgInsertWithout<PgInsertReturning<this, TDynamic, TSelectedFields>, TDynamic, 'returning'>;
    /**
     * Adds an `on conflict do nothing` clause to the query.
     *
     * Calling this method simply avoids inserting a row as its alternative action.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
     *
     * @param config The `target` and `where` clauses.
     *
     * @example
     * ```ts
     * // Insert one row and cancel the insert if there's a conflict
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoNothing();
     *
     * // Explicitly specify conflict target
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoNothing({ target: cars.id });
     * ```
     */
    onConflictDoNothing(config?: {
        target?: IndexColumn | IndexColumn[];
        where?: SQL;
    }): PgInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
    /**
     * Adds an `on conflict do update` clause to the query.
     *
     * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
     *
     * @param config The `target`, `set` and `where` clauses.
     *
     * @example
     * ```ts
     * // Update the row if there's a conflict
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoUpdate({
     *     target: cars.id,
     *     set: { brand: 'Porsche' }
     *   });
     *
     * // Upsert with 'where' clause
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoUpdate({
     *     target: cars.id,
     *     set: { brand: 'newBMW' },
     *     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
     *   });
     * ```
     */
    onConflictDoUpdate(config: PgInsertOnConflictDoUpdateConfig<this>): PgInsertWithout<this, TDynamic, 'onConflictDoNothing' | 'onConflictDoUpdate'>;
    toSQL(): Query;
    prepare(name: string): PgInsertPrepare<this>;
    private authToken?;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): PgInsertDynamic<this>;
}
