import type { WithCacheConfig } from "../../cache/core/types.cjs";
import type { GetColumnData } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { PgDialect } from "../dialect.cjs";
import type { PgPreparedQuery, PgQueryResultHKT, PgQueryResultKind, PgSession, PreparedQueryConfig } from "../session.cjs";
import { PgTable } from "../table.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { AppendToNullabilityMap, AppendToResult, GetSelectTableName, GetSelectTableSelection, JoinNullability, JoinType, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import { type ColumnsSelection, type Query, SQL, type SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { Table } from "../../table.cjs";
import { type Assume, type DrizzleTypeError, type Equal, type NeonAuthToken, type Simplify, type UpdateSet } from "../../utils.cjs";
import type { PgColumn } from "../columns/common.cjs";
import type { PgViewBase } from "../view-base.cjs";
import type { PgSelectJoinConfig, SelectedFields, SelectedFieldsOrdered, TableLikeHasEmptySelection } from "./select.types.cjs";
export interface PgUpdateConfig {
    where?: SQL | undefined;
    set: UpdateSet;
    table: PgTable;
    from?: PgTable | Subquery | PgViewBase | SQL;
    joins: PgSelectJoinConfig[];
    returningFields?: SelectedFields;
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type PgUpdateSetSource<TTable extends PgTable> = {
    [Key in keyof TTable['$inferInsert']]?: GetColumnData<TTable['_']['columns'][Key]> | SQL | PgColumn | undefined;
} & {};
export declare class PgUpdateBuilder<TTable extends PgTable, TQueryResult extends PgQueryResultHKT> {
    private table;
    private session;
    private dialect;
    private withList?;
    static readonly [entityKind]: string;
    readonly _: {
        readonly table: TTable;
    };
    constructor(table: TTable, session: PgSession, dialect: PgDialect, withList?: Subquery[] | undefined);
    private authToken?;
    setToken(token: NeonAuthToken): this;
    set(values: PgUpdateSetSource<TTable>): PgUpdateWithout<PgUpdateBase<TTable, TQueryResult>, false, 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>;
}
export type PgUpdateWithout<T extends AnyPgUpdate, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<PgUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['selectedFields'], T['_']['returning'], T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type PgUpdateWithJoins<T extends AnyPgUpdate, TDynamic extends boolean, TFrom extends PgTable | Subquery | PgViewBase | SQL> = TDynamic extends true ? T : Omit<PgUpdateBase<T['_']['table'], T['_']['queryResult'], TFrom, T['_']['selectedFields'], T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TFrom>, 'inner'>, [
    ...T['_']['joins'],
    {
        name: GetSelectTableName<TFrom>;
        joinType: 'inner';
        table: TFrom;
    }
], TDynamic, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>;
export type PgUpdateJoinFn<T extends AnyPgUpdate, TDynamic extends boolean, TJoinType extends JoinType> = <TJoinedTable extends PgTable | Subquery | PgViewBase | SQL>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable, on: ((updateTable: T['_']['table']['_']['columns'], from: T['_']['from'] extends PgTable ? T['_']['from']['_']['columns'] : T['_']['from'] extends Subquery | PgViewBase ? T['_']['from']['_']['selectedFields'] : never) => SQL | undefined) | SQL | undefined) => PgUpdateJoin<T, TDynamic, TJoinType, TJoinedTable>;
export type PgUpdateJoin<T extends AnyPgUpdate, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends PgTable | Subquery | PgViewBase | SQL> = TDynamic extends true ? T : PgUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['selectedFields'], T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TJoinedTable>, TJoinType>, [
    ...T['_']['joins'],
    {
        name: GetSelectTableName<TJoinedTable>;
        joinType: TJoinType;
        table: TJoinedTable;
    }
], TDynamic, T['_']['excludedMethods']>;
type Join = {
    name: string | undefined;
    joinType: JoinType;
    table: PgTable | Subquery | PgViewBase | SQL;
};
type AccumulateToResult<T extends AnyPgUpdate, TSelectMode extends SelectMode, TJoins extends Join[], TSelectedFields extends ColumnsSelection> = TJoins extends [infer TJoin extends Join, ...infer TRest extends Join[]] ? AccumulateToResult<T, TSelectMode extends 'partial' ? TSelectMode : 'multiple', TRest, AppendToResult<T['_']['table']['_']['name'], TSelectedFields, TJoin['name'], TJoin['table'] extends Table ? TJoin['table']['_']['columns'] : TJoin['table'] extends Subquery ? Assume<TJoin['table']['_']['selectedFields'], SelectedFields> : never, TSelectMode extends 'partial' ? TSelectMode : 'multiple'>> : TSelectedFields;
export type PgUpdateReturningAll<T extends AnyPgUpdate, TDynamic extends boolean> = PgUpdateWithout<PgUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], Equal<T['_']['joins'], []> extends true ? T['_']['table']['_']['columns'] : Simplify<Record<T['_']['table']['_']['name'], T['_']['table']['_']['columns']> & {
    [K in keyof T['_']['joins'] as T['_']['joins'][K]['table']['_']['name']]: T['_']['joins'][K]['table']['_']['columns'];
}>, SelectResult<AccumulateToResult<T, 'single', T['_']['joins'], GetSelectTableSelection<T['_']['table']>>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type PgUpdateReturning<T extends AnyPgUpdate, TDynamic extends boolean, TSelectedFields extends SelectedFields> = PgUpdateWithout<PgUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], TSelectedFields, SelectResult<AccumulateToResult<T, 'partial', T['_']['joins'], TSelectedFields>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type PgUpdatePrepare<T extends AnyPgUpdate> = PgPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type PgUpdateDynamic<T extends AnyPgUpdate> = PgUpdate<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['returning'], T['_']['nullabilityMap']>;
export type PgUpdate<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = []> = PgUpdateBase<TTable, TQueryResult, TFrom, TSelectedFields, TReturning, TNullabilityMap, TJoins, true, never>;
export type AnyPgUpdate = PgUpdateBase<any, any, any, any, any, any, any, any, any>;
export interface PgUpdateBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'pg';
        readonly table: TTable;
        readonly joins: TJoins;
        readonly nullabilityMap: TNullabilityMap;
        readonly queryResult: TQueryResult;
        readonly from: TFrom;
        readonly selectedFields: TSelectedFields;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export declare class PgUpdateBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    private tableName;
    private joinsNotNullableMap;
    protected cacheConfig?: WithCacheConfig;
    constructor(table: TTable, set: UpdateSet, session: PgSession, dialect: PgDialect, withList?: Subquery[]);
    from<TFrom extends PgTable | Subquery | PgViewBase | SQL>(source: TableLikeHasEmptySelection<TFrom> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TFrom): PgUpdateWithJoins<this, TDynamic, TFrom>;
    private getTableLikeFields;
    private createJoin;
    leftJoin: PgUpdateJoinFn<this, TDynamic, "left">;
    rightJoin: PgUpdateJoinFn<this, TDynamic, "right">;
    innerJoin: PgUpdateJoinFn<this, TDynamic, "inner">;
    fullJoin: PgUpdateJoinFn<this, TDynamic, "full">;
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
     * await db.update(cars).set({ color: 'red' })
     *   .where(eq(cars.color, 'green'));
     * // or
     * await db.update(cars).set({ color: 'red' })
     *   .where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Update all BMW cars with a green color
     * await db.update(cars).set({ color: 'red' })
     *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Update all cars with the green or blue color
     * await db.update(cars).set({ color: 'red' })
     *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where: SQL | undefined): PgUpdateWithout<this, TDynamic, 'where'>;
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
    returning(): PgUpdateReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFields>(fields: TSelectedFields): PgUpdateReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(name: string): PgUpdatePrepare<this>;
    private authToken?;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): PgUpdateDynamic<this>;
}
export {};
