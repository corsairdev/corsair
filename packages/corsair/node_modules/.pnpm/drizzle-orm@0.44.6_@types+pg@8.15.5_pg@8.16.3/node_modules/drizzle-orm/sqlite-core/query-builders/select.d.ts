import type { CacheConfig, WithCacheConfig } from "../../cache/core/types.js";
import { entityKind } from "../../entity.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import type { BuildSubquerySelection, GetSelectTableName, GetSelectTableSelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import { SQL } from "../../sql/sql.js";
import type { ColumnsSelection, Placeholder, Query, SQLWrapper } from "../../sql/sql.js";
import type { SQLiteColumn } from "../columns/index.js";
import type { SQLiteDialect } from "../dialect.js";
import type { SQLiteSession } from "../session.js";
import type { SubqueryWithSelection } from "../subquery.js";
import type { SQLiteTable } from "../table.js";
import { Subquery } from "../../subquery.js";
import { type ValueOrArray } from "../../utils.js";
import { SQLiteViewBase } from "../view-base.js";
import type { CreateSQLiteSelectFromBuilderMode, GetSQLiteSetOperators, SelectedFields, SetOperatorRightSelect, SQLiteCreateSetOperatorFn, SQLiteSelectConfig, SQLiteSelectCrossJoinFn, SQLiteSelectDynamic, SQLiteSelectExecute, SQLiteSelectHKT, SQLiteSelectHKTBase, SQLiteSelectJoinFn, SQLiteSelectPrepare, SQLiteSelectWithout, SQLiteSetOperatorExcludedMethods, SQLiteSetOperatorWithResult } from "./select.types.js";
export declare class SQLiteSelectBuilder<TSelection extends SelectedFields | undefined, TResultType extends 'sync' | 'async', TRunResult, TBuilderMode extends 'db' | 'qb' = 'db'> {
    static readonly [entityKind]: string;
    private fields;
    private session;
    private dialect;
    private withList;
    private distinct;
    constructor(config: {
        fields: TSelection;
        session: SQLiteSession<any, any, any, any> | undefined;
        dialect: SQLiteDialect;
        withList?: Subquery[];
        distinct?: boolean;
    });
    from<TFrom extends SQLiteTable | Subquery | SQLiteViewBase | SQL>(source: TFrom): CreateSQLiteSelectFromBuilderMode<TBuilderMode, GetSelectTableName<TFrom>, TResultType, TRunResult, TSelection extends undefined ? GetSelectTableSelection<TFrom> : TSelection, TSelection extends undefined ? 'single' : 'partial'>;
}
export declare abstract class SQLiteSelectQueryBuilderBase<THKT extends SQLiteSelectHKTBase, TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends TypedQueryBuilder<TSelectedFields, TResult> {
    static readonly [entityKind]: string;
    readonly _: {
        readonly dialect: 'sqlite';
        readonly hkt: THKT;
        readonly tableName: TTableName;
        readonly resultType: TResultType;
        readonly runResult: TRunResult;
        readonly selection: TSelection;
        readonly selectMode: TSelectMode;
        readonly nullabilityMap: TNullabilityMap;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TResult;
        readonly selectedFields: TSelectedFields;
        readonly config: SQLiteSelectConfig;
    };
    protected joinsNotNullableMap: Record<string, boolean>;
    private tableName;
    private isPartialSelect;
    protected session: SQLiteSession<any, any, any, any> | undefined;
    protected dialect: SQLiteDialect;
    protected cacheConfig?: WithCacheConfig;
    protected usedTables: Set<string>;
    constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }: {
        table: SQLiteSelectConfig['table'];
        fields: SQLiteSelectConfig['fields'];
        isPartialSelect: boolean;
        session: SQLiteSession<any, any, any, any> | undefined;
        dialect: SQLiteDialect;
        withList: Subquery[] | undefined;
        distinct: boolean | undefined;
    });
    private createJoin;
    /**
     * Executes a `left join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    leftJoin: SQLiteSelectJoinFn<this, TDynamic, "left">;
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    rightJoin: SQLiteSelectJoinFn<this, TDynamic, "right">;
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    innerJoin: SQLiteSelectJoinFn<this, TDynamic, "inner">;
    /**
     * Executes a `full join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    fullJoin: SQLiteSelectJoinFn<this, TDynamic, "full">;
    /**
     * Executes a `cross join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
     *
     * @param table the table to join.
     *
     * @example
     *
     * ```ts
     * // Select all users, each user with every pet
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .crossJoin(pets)
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .crossJoin(pets)
     * ```
     */
    crossJoin: SQLiteSelectCrossJoinFn<this, TDynamic>;
    private createSetOperator;
    /**
     * Adds `union` set operator to the query.
     *
     * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
     *
     * @example
     *
     * ```ts
     * // Select all unique names from customers and users tables
     * await db.select({ name: users.name })
     *   .from(users)
     *   .union(
     *     db.select({ name: customers.name }).from(customers)
     *   );
     * // or
     * import { union } from 'drizzle-orm/sqlite-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    union: <TValue extends SQLiteSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetSQLiteSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => SQLiteSelectWithout<this, TDynamic, SQLiteSetOperatorExcludedMethods, true>;
    /**
     * Adds `union all` set operator to the query.
     *
     * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
     *
     * @example
     *
     * ```ts
     * // Select all transaction ids from both online and in-store sales
     * await db.select({ transaction: onlineSales.transactionId })
     *   .from(onlineSales)
     *   .unionAll(
     *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     *   );
     * // or
     * import { unionAll } from 'drizzle-orm/sqlite-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    unionAll: <TValue extends SQLiteSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetSQLiteSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => SQLiteSelectWithout<this, TDynamic, SQLiteSetOperatorExcludedMethods, true>;
    /**
     * Adds `intersect` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
     *
     * @example
     *
     * ```ts
     * // Select course names that are offered in both departments A and B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .intersect(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { intersect } from 'drizzle-orm/sqlite-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    intersect: <TValue extends SQLiteSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetSQLiteSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => SQLiteSelectWithout<this, TDynamic, SQLiteSetOperatorExcludedMethods, true>;
    /**
     * Adds `except` set operator to the query.
     *
     * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
     *
     * @example
     *
     * ```ts
     * // Select all courses offered in department A but not in department B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .except(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { except } from 'drizzle-orm/sqlite-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    except: <TValue extends SQLiteSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetSQLiteSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => SQLiteSelectWithout<this, TDynamic, SQLiteSetOperatorExcludedMethods, true>;
    /**
     * Adds a `where` clause to the query.
     *
     * Calling this method will select only those rows that fulfill a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
     *
     * @param where the `where` clause.
     *
     * @example
     * You can use conditional operators and `sql function` to filter the rows to be selected.
     *
     * ```ts
     * // Select all cars with green color
     * await db.select().from(cars).where(eq(cars.color, 'green'));
     * // or
     * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Select all BMW cars with a green color
     * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Select all cars with the green or blue color
     * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where: ((aliases: TSelection) => SQL | undefined) | SQL | undefined): SQLiteSelectWithout<this, TDynamic, 'where'>;
    /**
     * Adds a `having` clause to the query.
     *
     * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
     *
     * @param having the `having` clause.
     *
     * @example
     *
     * ```ts
     * // Select all brands with more than one car
     * await db.select({
     * 	brand: cars.brand,
     * 	count: sql<number>`cast(count(${cars.id}) as int)`,
     * })
     *   .from(cars)
     *   .groupBy(cars.brand)
     *   .having(({ count }) => gt(count, 1));
     * ```
     */
    having(having: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): SQLiteSelectWithout<this, TDynamic, 'having'>;
    /**
     * Adds a `group by` clause to the query.
     *
     * Calling this method will group rows that have the same values into summary rows, often used for aggregation purposes.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
     *
     * @example
     *
     * ```ts
     * // Group and count people by their last names
     * await db.select({
     *    lastName: people.lastName,
     *    count: sql<number>`cast(count(*) as int)`
     * })
     *   .from(people)
     *   .groupBy(people.lastName);
     * ```
     */
    groupBy(builder: (aliases: this['_']['selection']) => ValueOrArray<SQLiteColumn | SQL | SQL.Aliased>): SQLiteSelectWithout<this, TDynamic, 'groupBy'>;
    groupBy(...columns: (SQLiteColumn | SQL)[]): SQLiteSelectWithout<this, TDynamic, 'groupBy'>;
    /**
     * Adds an `order by` clause to the query.
     *
     * Calling this method will sort the result-set in ascending or descending order. By default, the sort order is ascending.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#order-by}
     *
     * @example
     *
     * ```
     * // Select cars ordered by year
     * await db.select().from(cars).orderBy(cars.year);
     * ```
     *
     * You can specify whether results are in ascending or descending order with the `asc()` and `desc()` operators.
     *
     * ```ts
     * // Select cars ordered by year in descending order
     * await db.select().from(cars).orderBy(desc(cars.year));
     *
     * // Select cars ordered by year and price
     * await db.select().from(cars).orderBy(asc(cars.year), desc(cars.price));
     * ```
     */
    orderBy(builder: (aliases: this['_']['selection']) => ValueOrArray<SQLiteColumn | SQL | SQL.Aliased>): SQLiteSelectWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (SQLiteColumn | SQL)[]): SQLiteSelectWithout<this, TDynamic, 'orderBy'>;
    /**
     * Adds a `limit` clause to the query.
     *
     * Calling this method will set the maximum number of rows that will be returned by this query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
     *
     * @param limit the `limit` clause.
     *
     * @example
     *
     * ```ts
     * // Get the first 10 people from this query.
     * await db.select().from(people).limit(10);
     * ```
     */
    limit(limit: number | Placeholder): SQLiteSelectWithout<this, TDynamic, 'limit'>;
    /**
     * Adds an `offset` clause to the query.
     *
     * Calling this method will skip a number of rows when returning results from this query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
     *
     * @param offset the `offset` clause.
     *
     * @example
     *
     * ```ts
     * // Get the 10th-20th people from this query.
     * await db.select().from(people).offset(10).limit(10);
     * ```
     */
    offset(offset: number | Placeholder): SQLiteSelectWithout<this, TDynamic, 'offset'>;
    toSQL(): Query;
    as<TAlias extends string>(alias: TAlias): SubqueryWithSelection<this['_']['selectedFields'], TAlias>;
    $dynamic(): SQLiteSelectDynamic<this>;
}
export interface SQLiteSelectBase<TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TSelectMode extends SelectMode = 'single', TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends SQLiteSelectQueryBuilderBase<SQLiteSelectHKT, TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, QueryPromise<TResult> {
}
export declare class SQLiteSelectBase<TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection, TSelectMode extends SelectMode = 'single', TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends SQLiteSelectQueryBuilderBase<SQLiteSelectHKT, TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
    static readonly [entityKind]: string;
    $withCache(config?: {
        config?: CacheConfig;
        tag?: string;
        autoInvalidate?: boolean;
    } | false): this;
    prepare(): SQLiteSelectPrepare<this>;
    run: ReturnType<this['prepare']>['run'];
    all: ReturnType<this['prepare']>['all'];
    get: ReturnType<this['prepare']>['get'];
    values: ReturnType<this['prepare']>['values'];
    execute(): Promise<SQLiteSelectExecute<this>>;
}
/**
 * Adds `union` set operator to the query.
 *
 * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
 *
 * @example
 *
 * ```ts
 * // Select all unique names from customers and users tables
 * import { union } from 'drizzle-orm/sqlite-core'
 *
 * await union(
 *   db.select({ name: users.name }).from(users),
 *   db.select({ name: customers.name }).from(customers)
 * );
 * // or
 * await db.select({ name: users.name })
 *   .from(users)
 *   .union(
 *     db.select({ name: customers.name }).from(customers)
 *   );
 * ```
 */
export declare const union: SQLiteCreateSetOperatorFn;
/**
 * Adds `union all` set operator to the query.
 *
 * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
 *
 * @example
 *
 * ```ts
 * // Select all transaction ids from both online and in-store sales
 * import { unionAll } from 'drizzle-orm/sqlite-core'
 *
 * await unionAll(
 *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
 *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
 * );
 * // or
 * await db.select({ transaction: onlineSales.transactionId })
 *   .from(onlineSales)
 *   .unionAll(
 *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
 *   );
 * ```
 */
export declare const unionAll: SQLiteCreateSetOperatorFn;
/**
 * Adds `intersect` set operator to the query.
 *
 * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
 *
 * @example
 *
 * ```ts
 * // Select course names that are offered in both departments A and B
 * import { intersect } from 'drizzle-orm/sqlite-core'
 *
 * await intersect(
 *   db.select({ courseName: depA.courseName }).from(depA),
 *   db.select({ courseName: depB.courseName }).from(depB)
 * );
 * // or
 * await db.select({ courseName: depA.courseName })
 *   .from(depA)
 *   .intersect(
 *     db.select({ courseName: depB.courseName }).from(depB)
 *   );
 * ```
 */
export declare const intersect: SQLiteCreateSetOperatorFn;
/**
 * Adds `except` set operator to the query.
 *
 * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
 *
 * @example
 *
 * ```ts
 * // Select all courses offered in department A but not in department B
 * import { except } from 'drizzle-orm/sqlite-core'
 *
 * await except(
 *   db.select({ courseName: depA.courseName }).from(depA),
 *   db.select({ courseName: depB.courseName }).from(depB)
 * );
 * // or
 * await db.select({ courseName: depA.courseName })
 *   .from(depA)
 *   .except(
 *     db.select({ courseName: depB.courseName }).from(depB)
 *   );
 * ```
 */
export declare const except: SQLiteCreateSetOperatorFn;
