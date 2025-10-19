import type { GetColumnData } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { GelDialect } from "../dialect.cjs";
import type { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.cjs";
import { GelTable } from "../table.cjs";
import type { AppendToNullabilityMap, AppendToResult, GetSelectTableName, GetSelectTableSelection, JoinNullability, JoinType, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import { type ColumnsSelection, type Query, SQL, type SQLWrapper } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { Table } from "../../table.cjs";
import { type Assume, type NeonAuthToken, type UpdateSet } from "../../utils.cjs";
import type { GelColumn } from "../columns/common.cjs";
import type { GelViewBase } from "../view-base.cjs";
import type { GelSelectJoinConfig, SelectedFields, SelectedFieldsOrdered } from "./select.types.cjs";
export interface GelUpdateConfig {
    where?: SQL | undefined;
    set: UpdateSet;
    table: GelTable;
    from?: GelTable | Subquery | GelViewBase | SQL;
    joins: GelSelectJoinConfig[];
    returning?: SelectedFieldsOrdered;
    withList?: Subquery[];
}
export type GelUpdateSetSource<TTable extends GelTable> = {
    [Key in keyof TTable['$inferInsert']]?: GetColumnData<TTable['_']['columns'][Key]> | SQL | GelColumn;
} & {};
export declare class GelUpdateBuilder<TTable extends GelTable, TQueryResult extends GelQueryResultHKT> {
    private table;
    private session;
    private dialect;
    private withList?;
    static readonly [entityKind]: string;
    readonly _: {
        readonly table: TTable;
    };
    constructor(table: TTable, session: GelSession, dialect: GelDialect, withList?: Subquery[] | undefined);
    private authToken?;
    setToken(token: NeonAuthToken): this;
    set(values: GelUpdateSetSource<TTable>): GelUpdateWithout<GelUpdateBase<TTable, TQueryResult>, false, 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>;
}
export type GelUpdateWithout<T extends AnyGelUpdate, TDynamic extends boolean, K extends keyof T & string> = TDynamic extends true ? T : Omit<GelUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['returning'], T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods'] | K>, T['_']['excludedMethods'] | K>;
export type GelUpdateWithJoins<T extends AnyGelUpdate, TDynamic extends boolean, TFrom extends GelTable | Subquery | GelViewBase | SQL> = TDynamic extends true ? T : Omit<GelUpdateBase<T['_']['table'], T['_']['queryResult'], TFrom, T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TFrom>, 'inner'>, [
    ...T['_']['joins'],
    {
        name: GetSelectTableName<TFrom>;
        joinType: 'inner';
        table: TFrom;
    }
], TDynamic, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>, Exclude<T['_']['excludedMethods'] | 'from', 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin'>>;
export type GelUpdateJoinFn<T extends AnyGelUpdate, TDynamic extends boolean, TJoinType extends JoinType> = <TJoinedTable extends GelTable | Subquery | GelViewBase | SQL>(table: TJoinedTable, on: ((updateTable: T['_']['table']['_']['columns'], from: T['_']['from'] extends GelTable ? T['_']['from']['_']['columns'] : T['_']['from'] extends Subquery | GelViewBase ? T['_']['from']['_']['selectedFields'] : never) => SQL | undefined) | SQL | undefined) => GelUpdateJoin<T, TDynamic, TJoinType, TJoinedTable>;
export type GelUpdateJoin<T extends AnyGelUpdate, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends GelTable | Subquery | GelViewBase | SQL> = TDynamic extends true ? T : GelUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['returning'], AppendToNullabilityMap<T['_']['nullabilityMap'], GetSelectTableName<TJoinedTable>, TJoinType>, [
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
    table: GelTable | Subquery | GelViewBase | SQL;
};
type AccumulateToResult<T extends AnyGelUpdate, TSelectMode extends SelectMode, TJoins extends Join[], TSelectedFields extends ColumnsSelection> = TJoins extends [infer TJoin extends Join, ...infer TRest extends Join[]] ? AccumulateToResult<T, TSelectMode extends 'partial' ? TSelectMode : 'multiple', TRest, AppendToResult<T['_']['table']['_']['name'], TSelectedFields, TJoin['name'], TJoin['table'] extends Table ? TJoin['table']['_']['columns'] : TJoin['table'] extends Subquery ? Assume<TJoin['table']['_']['selectedFields'], SelectedFields> : never, TSelectMode extends 'partial' ? TSelectMode : 'multiple'>> : TSelectedFields;
export type GelUpdateReturningAll<T extends AnyGelUpdate, TDynamic extends boolean> = GelUpdateWithout<GelUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], SelectResult<AccumulateToResult<T, 'single', T['_']['joins'], GetSelectTableSelection<T['_']['table']>>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type GelUpdateReturning<T extends AnyGelUpdate, TDynamic extends boolean, TSelectedFields extends SelectedFields> = GelUpdateWithout<GelUpdateBase<T['_']['table'], T['_']['queryResult'], T['_']['from'], SelectResult<AccumulateToResult<T, 'partial', T['_']['joins'], TSelectedFields>, 'partial', T['_']['nullabilityMap']>, T['_']['nullabilityMap'], T['_']['joins'], TDynamic, T['_']['excludedMethods']>, TDynamic, 'returning'>;
export type GelUpdatePrepare<T extends AnyGelUpdate> = GelPreparedQuery<PreparedQueryConfig & {
    execute: T['_']['returning'] extends undefined ? GelQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
export type GelUpdateDynamic<T extends AnyGelUpdate> = GelUpdate<T['_']['table'], T['_']['queryResult'], T['_']['from'], T['_']['returning'], T['_']['nullabilityMap']>;
export type GelUpdate<TTable extends GelTable = GelTable, TQueryResult extends GelQueryResultHKT = GelQueryResultHKT, TFrom extends GelTable | Subquery | GelViewBase | SQL | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = []> = GelUpdateBase<TTable, TQueryResult, TFrom, TReturning, TNullabilityMap, TJoins, true, never>;
export type AnyGelUpdate = GelUpdateBase<any, any, any, any, any, any, any, any>;
export interface GelUpdateBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TFrom extends GelTable | Subquery | GelViewBase | SQL | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'gel';
        readonly table: TTable;
        readonly joins: TJoins;
        readonly nullabilityMap: TNullabilityMap;
        readonly queryResult: TQueryResult;
        readonly from: TFrom;
        readonly returning: TReturning;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[];
    };
}
export declare class GelUpdateBase<TTable extends GelTable, TQueryResult extends GelQueryResultHKT, TFrom extends GelTable | Subquery | GelViewBase | SQL | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[]> implements RunnableQuery<TReturning extends undefined ? GelQueryResultKind<TQueryResult, never> : TReturning[], 'gel'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    private tableName;
    private joinsNotNullableMap;
    constructor(table: TTable, set: UpdateSet, session: GelSession, dialect: GelDialect, withList?: Subquery[]);
    from<TFrom extends GelTable | Subquery | GelViewBase | SQL>(source: TFrom): GelUpdateWithJoins<this, TDynamic, TFrom>;
    private getTableLikeFields;
    private createJoin;
    leftJoin: GelUpdateJoinFn<this, TDynamic, "left">;
    rightJoin: GelUpdateJoinFn<this, TDynamic, "right">;
    innerJoin: GelUpdateJoinFn<this, TDynamic, "inner">;
    fullJoin: GelUpdateJoinFn<this, TDynamic, "full">;
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
    where(where: SQL | undefined): GelUpdateWithout<this, TDynamic, 'where'>;
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
    returning(): GelUpdateReturningAll<this, TDynamic>;
    returning<TSelectedFields extends SelectedFields>(fields: TSelectedFields): GelUpdateReturning<this, TDynamic, TSelectedFields>;
    toSQL(): Query;
    prepare(name: string): GelUpdatePrepare<this>;
    execute: ReturnType<this['prepare']>['execute'];
    $dynamic(): GelUpdateDynamic<this>;
}
export {};
