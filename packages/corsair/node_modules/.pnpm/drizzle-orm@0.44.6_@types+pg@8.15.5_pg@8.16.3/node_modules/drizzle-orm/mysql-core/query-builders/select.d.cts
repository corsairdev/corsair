import type { CacheConfig, WithCacheConfig } from "../../cache/core/types.cjs";
import { entityKind } from "../../entity.cjs";
import type { MySqlColumn } from "../columns/index.cjs";
import type { MySqlDialect } from "../dialect.cjs";
import type { MySqlSession, PreparedQueryHKTBase } from "../session.cjs";
import type { SubqueryWithSelection } from "../subquery.cjs";
import { MySqlTable } from "../table.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { BuildSubquerySelection, GetSelectTableName, GetSelectTableSelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { ColumnsSelection, Placeholder, Query } from "../../sql/sql.cjs";
import { SQL } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import type { ValueOrArray } from "../../utils.cjs";
import type { IndexBuilder } from "../indexes.cjs";
import { MySqlViewBase } from "../view-base.cjs";
import type { CreateMySqlSelectFromBuilderMode, GetMySqlSetOperators, LockConfig, LockStrength, MySqlCreateSetOperatorFn, MySqlCrossJoinFn, MySqlJoinFn, MySqlSelectConfig, MySqlSelectDynamic, MySqlSelectHKT, MySqlSelectHKTBase, MySqlSelectPrepare, MySqlSelectWithout, MySqlSetOperatorExcludedMethods, MySqlSetOperatorWithResult, SelectedFields, SetOperatorRightSelect } from "./select.types.cjs";
export type IndexForHint = IndexBuilder | string;
export type IndexConfig = {
    useIndex?: IndexForHint | IndexForHint[];
    forceIndex?: IndexForHint | IndexForHint[];
    ignoreIndex?: IndexForHint | IndexForHint[];
};
export declare class MySqlSelectBuilder<TSelection extends SelectedFields | undefined, TPreparedQueryHKT extends PreparedQueryHKTBase, TBuilderMode extends 'db' | 'qb' = 'db'> {
    static readonly [entityKind]: string;
    private fields;
    private session;
    private dialect;
    private withList;
    private distinct;
    constructor(config: {
        fields: TSelection;
        session: MySqlSession | undefined;
        dialect: MySqlDialect;
        withList?: Subquery[];
        distinct?: boolean;
    });
    from<TFrom extends MySqlTable | Subquery | MySqlViewBase | SQL>(source: TFrom, onIndex?: TFrom extends MySqlTable ? IndexConfig : 'Index hint configuration is allowed only for MySqlTable and not for subqueries or views'): CreateMySqlSelectFromBuilderMode<TBuilderMode, GetSelectTableName<TFrom>, TSelection extends undefined ? GetSelectTableSelection<TFrom> : TSelection, TSelection extends undefined ? 'single' : 'partial', TPreparedQueryHKT>;
}
export declare abstract class MySqlSelectQueryBuilderBase<THKT extends MySqlSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends TypedQueryBuilder<TSelectedFields, TResult> {
    static readonly [entityKind]: string;
    readonly _: {
        readonly hkt: THKT;
        readonly tableName: TTableName;
        readonly selection: TSelection;
        readonly selectMode: TSelectMode;
        readonly preparedQueryHKT: TPreparedQueryHKT;
        readonly nullabilityMap: TNullabilityMap;
        readonly dynamic: TDynamic;
        readonly excludedMethods: TExcludedMethods;
        readonly result: TResult;
        readonly selectedFields: TSelectedFields;
        readonly config: MySqlSelectConfig;
    };
    protected config: MySqlSelectConfig;
    protected joinsNotNullableMap: Record<string, boolean>;
    private tableName;
    private isPartialSelect;
    protected dialect: MySqlDialect;
    protected cacheConfig?: WithCacheConfig;
    protected usedTables: Set<string>;
    constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct, useIndex, forceIndex, ignoreIndex }: {
        table: MySqlSelectConfig['table'];
        fields: MySqlSelectConfig['fields'];
        isPartialSelect: boolean;
        session: MySqlSession | undefined;
        dialect: MySqlDialect;
        withList: Subquery[];
        distinct: boolean | undefined;
        useIndex?: string[];
        forceIndex?: string[];
        ignoreIndex?: string[];
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
     * @param onIndex index hint.
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
     *
     * // Select userId and petId with use index hint
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId), {
     *     useIndex: ['pets_owner_id_index']
     * })
     * ```
     */
    leftJoin: MySqlJoinFn<this, TDynamic, "left", false>;
    /**
     * Executes a `left join lateral` operation by adding subquery to the current query.
     *
     * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join-lateral}
     *
     * @param table the subquery to join.
     * @param on the `on` clause.
     */
    leftJoinLateral: MySqlJoinFn<this, TDynamic, "left", true>;
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     * @param onIndex index hint.
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
     *
     * // Select userId and petId with use index hint
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId), {
     *     useIndex: ['pets_owner_id_index']
     * })
     * ```
     */
    rightJoin: MySqlJoinFn<this, TDynamic, "right", false>;
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     * @param onIndex index hint.
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
     *
     * // Select userId and petId with use index hint
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId), {
     *     useIndex: ['pets_owner_id_index']
     * })
     * ```
     */
    innerJoin: MySqlJoinFn<this, TDynamic, "inner", false>;
    /**
     * Executes an `inner join lateral` operation, creating a new table by combining rows from two queries that have matching values.
     *
     * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join-lateral}
     *
     * @param table the subquery to join.
     * @param on the `on` clause.
     */
    innerJoinLateral: MySqlJoinFn<this, TDynamic, "inner", true>;
    /**
     * Executes a `cross join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
     *
     * @param table the table to join.
     * @param onIndex index hint.
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
     *
     * // Select userId and petId with use index hint
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .crossJoin(pets, {
     *     useIndex: ['pets_owner_id_index']
     * })
     * ```
     */
    crossJoin: MySqlCrossJoinFn<this, TDynamic, false>;
    /**
     * Executes a `cross join lateral` operation by combining rows from two queries into a new table.
     *
     * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
     *
     * Calling this method retrieves all rows from both main and joined queries, merging all rows from each query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join-lateral}
     *
     * @param table the query to join.
     */
    crossJoinLateral: MySqlCrossJoinFn<this, TDynamic, true>;
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
     * import { union } from 'drizzle-orm/mysql-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    union: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
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
     * import { unionAll } from 'drizzle-orm/mysql-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    unionAll: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
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
     * import { intersect } from 'drizzle-orm/mysql-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    intersect: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
    /**
     * Adds `intersect all` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets including all duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
     *
     * @example
     *
     * ```ts
     * // Select all products and quantities that are ordered by both regular and VIP customers
     * await db.select({
     *   productId: regularCustomerOrders.productId,
     *   quantityOrdered: regularCustomerOrders.quantityOrdered
     * })
     * .from(regularCustomerOrders)
     * .intersectAll(
     *   db.select({
     *     productId: vipCustomerOrders.productId,
     *     quantityOrdered: vipCustomerOrders.quantityOrdered
     *   })
     *   .from(vipCustomerOrders)
     * );
     * // or
     * import { intersectAll } from 'drizzle-orm/mysql-core'
     *
     * await intersectAll(
     *   db.select({
     *     productId: regularCustomerOrders.productId,
     *     quantityOrdered: regularCustomerOrders.quantityOrdered
     *   })
     *   .from(regularCustomerOrders),
     *   db.select({
     *     productId: vipCustomerOrders.productId,
     *     quantityOrdered: vipCustomerOrders.quantityOrdered
     *   })
     *   .from(vipCustomerOrders)
     * );
     * ```
     */
    intersectAll: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
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
     * import { except } from 'drizzle-orm/mysql-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    except: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
    /**
     * Adds `except all` set operator to the query.
     *
     * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
     *
     * @example
     *
     * ```ts
     * // Select all products that are ordered by regular customers but not by VIP customers
     * await db.select({
     *   productId: regularCustomerOrders.productId,
     *   quantityOrdered: regularCustomerOrders.quantityOrdered,
     * })
     * .from(regularCustomerOrders)
     * .exceptAll(
     *   db.select({
     *     productId: vipCustomerOrders.productId,
     *     quantityOrdered: vipCustomerOrders.quantityOrdered,
     *   })
     *   .from(vipCustomerOrders)
     * );
     * // or
     * import { exceptAll } from 'drizzle-orm/mysql-core'
     *
     * await exceptAll(
     *   db.select({
     *     productId: regularCustomerOrders.productId,
     *     quantityOrdered: regularCustomerOrders.quantityOrdered
     *   })
     *   .from(regularCustomerOrders),
     *   db.select({
     *     productId: vipCustomerOrders.productId,
     *     quantityOrdered: vipCustomerOrders.quantityOrdered
     *   })
     *   .from(vipCustomerOrders)
     * );
     * ```
     */
    exceptAll: <TValue extends MySqlSetOperatorWithResult<TResult>>(rightSelection: ((setOperators: GetMySqlSetOperators) => SetOperatorRightSelect<TValue, TResult>) | SetOperatorRightSelect<TValue, TResult>) => MySqlSelectWithout<this, TDynamic, MySqlSetOperatorExcludedMethods, true>;
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
    where(where: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): MySqlSelectWithout<this, TDynamic, 'where'>;
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
    having(having: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined): MySqlSelectWithout<this, TDynamic, 'having'>;
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
    groupBy(builder: (aliases: this['_']['selection']) => ValueOrArray<MySqlColumn | SQL | SQL.Aliased>): MySqlSelectWithout<this, TDynamic, 'groupBy'>;
    groupBy(...columns: (MySqlColumn | SQL | SQL.Aliased)[]): MySqlSelectWithout<this, TDynamic, 'groupBy'>;
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
    orderBy(builder: (aliases: this['_']['selection']) => ValueOrArray<MySqlColumn | SQL | SQL.Aliased>): MySqlSelectWithout<this, TDynamic, 'orderBy'>;
    orderBy(...columns: (MySqlColumn | SQL | SQL.Aliased)[]): MySqlSelectWithout<this, TDynamic, 'orderBy'>;
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
    limit(limit: number | Placeholder): MySqlSelectWithout<this, TDynamic, 'limit'>;
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
    offset(offset: number | Placeholder): MySqlSelectWithout<this, TDynamic, 'offset'>;
    /**
     * Adds a `for` clause to the query.
     *
     * Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
     *
     * See docs: {@link https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html}
     *
     * @param strength the lock strength.
     * @param config the lock configuration.
     */
    for(strength: LockStrength, config?: LockConfig): MySqlSelectWithout<this, TDynamic, 'for'>;
    toSQL(): Query;
    as<TAlias extends string>(alias: TAlias): SubqueryWithSelection<this['_']['selectedFields'], TAlias>;
    $dynamic(): MySqlSelectDynamic<this>;
    $withCache(config?: {
        config?: CacheConfig;
        tag?: string;
        autoInvalidate?: boolean;
    } | false): this;
}
export interface MySqlSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> extends MySqlSelectQueryBuilderBase<MySqlSelectHKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, QueryPromise<TResult> {
}
export declare class MySqlSelectBase<TTableName extends string | undefined, TSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {}, TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> extends MySqlSelectQueryBuilderBase<MySqlSelectHKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields> {
    static readonly [entityKind]: string;
    prepare(): MySqlSelectPrepare<this>;
    execute: ReturnType<this["prepare"]>["execute"];
    private createIterator;
    iterator: ReturnType<this["prepare"]>["iterator"];
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
 * import { union } from 'drizzle-orm/mysql-core'
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
export declare const union: MySqlCreateSetOperatorFn;
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
 * import { unionAll } from 'drizzle-orm/mysql-core'
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
export declare const unionAll: MySqlCreateSetOperatorFn;
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
 * import { intersect } from 'drizzle-orm/mysql-core'
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
export declare const intersect: MySqlCreateSetOperatorFn;
/**
 * Adds `intersect all` set operator to the query.
 *
 * Calling this method will retain only the rows that are present in both result sets including all duplicates.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
 *
 * @example
 *
 * ```ts
 * // Select all products and quantities that are ordered by both regular and VIP customers
 * import { intersectAll } from 'drizzle-orm/mysql-core'
 *
 * await intersectAll(
 *   db.select({
 *     productId: regularCustomerOrders.productId,
 *     quantityOrdered: regularCustomerOrders.quantityOrdered
 *   })
 *   .from(regularCustomerOrders),
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * // or
 * await db.select({
 *   productId: regularCustomerOrders.productId,
 *   quantityOrdered: regularCustomerOrders.quantityOrdered
 * })
 * .from(regularCustomerOrders)
 * .intersectAll(
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * ```
 */
export declare const intersectAll: MySqlCreateSetOperatorFn;
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
 * import { except } from 'drizzle-orm/mysql-core'
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
export declare const except: MySqlCreateSetOperatorFn;
/**
 * Adds `except all` set operator to the query.
 *
 * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
 *
 * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
 *
 * @example
 *
 * ```ts
 * // Select all products that are ordered by regular customers but not by VIP customers
 * import { exceptAll } from 'drizzle-orm/mysql-core'
 *
 * await exceptAll(
 *   db.select({
 *     productId: regularCustomerOrders.productId,
 *     quantityOrdered: regularCustomerOrders.quantityOrdered
 *   })
 *   .from(regularCustomerOrders),
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered
 *   })
 *   .from(vipCustomerOrders)
 * );
 * // or
 * await db.select({
 *   productId: regularCustomerOrders.productId,
 *   quantityOrdered: regularCustomerOrders.quantityOrdered,
 * })
 * .from(regularCustomerOrders)
 * .exceptAll(
 *   db.select({
 *     productId: vipCustomerOrders.productId,
 *     quantityOrdered: vipCustomerOrders.quantityOrdered,
 *   })
 *   .from(vipCustomerOrders)
 * );
 * ```
 */
export declare const exceptAll: MySqlCreateSetOperatorFn;
