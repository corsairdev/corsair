import type { ResultSetHeader } from 'mysql2/promise';
import type { Cache } from "../cache/core/cache.cjs";
import { entityKind } from "../entity.cjs";
import type { ExtractTablesWithRelations, RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import type { SingleStoreDriverDatabase } from "../singlestore/driver.cjs";
import { type SQL, type SQLWrapper } from "../sql/sql.cjs";
import { WithSubquery } from "../subquery.cjs";
import type { SingleStoreDialect } from "./dialect.cjs";
import { SingleStoreCountBuilder } from "./query-builders/count.cjs";
import { SingleStoreDeleteBase, SingleStoreInsertBuilder, SingleStoreSelectBuilder, SingleStoreUpdateBuilder } from "./query-builders/index.cjs";
import type { SelectedFields } from "./query-builders/select.types.cjs";
import type { PreparedQueryHKTBase, SingleStoreQueryResultHKT, SingleStoreQueryResultKind, SingleStoreSession, SingleStoreTransaction, SingleStoreTransactionConfig } from "./session.cjs";
import type { WithBuilder } from "./subquery.cjs";
import type { SingleStoreTable } from "./table.cjs";
export declare class SingleStoreDatabase<TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = {}, TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>> {
    static readonly [entityKind]: string;
    readonly _: {
        readonly schema: TSchema | undefined;
        readonly fullSchema: TFullSchema;
        readonly tableNamesMap: Record<string, string>;
    };
    /**@inrernal */
    query: unknown;
    constructor(
    /** @internal */
    dialect: SingleStoreDialect, 
    /** @internal */
    session: SingleStoreSession<any, any, any, any>, schema: RelationalSchemaConfig<TSchema> | undefined);
    /**
     * Creates a subquery that defines a temporary named result set as a CTE.
     *
     * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param alias The alias for the subquery.
     *
     * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
     *
     * @example
     *
     * ```ts
     * // Create a subquery with alias 'sq' and use it in the select query
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * const result = await db.with(sq).select().from(sq);
     * ```
     *
     * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
     *
     * ```ts
     * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
     * const sq = db.$with('sq').as(db.select({
     *   name: sql<string>`upper(${users.name})`.as('name'),
     * })
     * .from(users));
     *
     * const result = await db.with(sq).select({ name: sq.name }).from(sq);
     * ```
     */
    $with: WithBuilder;
    $count(source: SingleStoreTable | SQL | SQLWrapper, // SingleStoreViewBase |
    filters?: SQL<unknown>): SingleStoreCountBuilder<SingleStoreSession<any, any, any, any>>;
    /**
     * Incorporates a previously defined CTE (using `$with`) into the main query.
     *
     * This method allows the main query to reference a temporary named result set.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param queries The CTEs to incorporate into the main query.
     *
     * @example
     *
     * ```ts
     * // Define a subquery 'sq' as a CTE using $with
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * // Incorporate the CTE 'sq' into the main query and select from it
     * const result = await db.with(sq).select().from(sq);
     * ```
     */
    with(...queries: WithSubquery[]): {
        select: {
            (): SingleStoreSelectBuilder<undefined, TPreparedQueryHKT>;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, TPreparedQueryHKT>;
        };
        selectDistinct: {
            (): SingleStoreSelectBuilder<undefined, TPreparedQueryHKT>;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, TPreparedQueryHKT>;
        };
        update: <TTable extends SingleStoreTable>(table: TTable) => SingleStoreUpdateBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
        delete: <TTable extends SingleStoreTable>(table: TTable) => SingleStoreDeleteBase<TTable, TQueryResult, TPreparedQueryHKT>;
    };
    /**
     * Creates a select query.
     *
     * Calling this method with no arguments will select all columns from the table. Pass a selection object to specify the columns you want to select.
     *
     * Use `.from()` method to specify which table to select from.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select}
     *
     * @param fields The selection object.
     *
     * @example
     *
     * ```ts
     * // Select all columns and all rows from the 'cars' table
     * const allCars: Car[] = await db.select().from(cars);
     *
     * // Select specific columns and all rows from the 'cars' table
     * const carsIdsAndBrands: { id: number; brand: string }[] = await db.select({
     *   id: cars.id,
     *   brand: cars.brand
     * })
     *   .from(cars);
     * ```
     *
     * Like in SQL, you can use arbitrary expressions as selection fields, not just table columns:
     *
     * ```ts
     * // Select specific columns along with expression and all rows from the 'cars' table
     * const carsIdsAndLowerNames: { id: number; lowerBrand: string }[] = await db.select({
     *   id: cars.id,
     *   lowerBrand: sql<string>`lower(${cars.brand})`,
     * })
     *   .from(cars);
     * ```
     */
    select(): SingleStoreSelectBuilder<undefined, TPreparedQueryHKT>;
    select<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, TPreparedQueryHKT>;
    /**
     * Adds `distinct` expression to the select query.
     *
     * Calling this method will return only unique values. When multiple columns are selected, it returns rows with unique combinations of values in these columns.
     *
     * Use `.from()` method to specify which table to select from.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#distinct}
     *
     * @param fields The selection object.
     *
     * @example
     * ```ts
     * // Select all unique rows from the 'cars' table
     * await db.selectDistinct()
     *   .from(cars)
     *   .orderBy(cars.id, cars.brand, cars.color);
     *
     * // Select all unique brands from the 'cars' table
     * await db.selectDistinct({ brand: cars.brand })
     *   .from(cars)
     *   .orderBy(cars.brand);
     * ```
     */
    selectDistinct(): SingleStoreSelectBuilder<undefined, TPreparedQueryHKT>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, TPreparedQueryHKT>;
    /**
     * Creates an update query.
     *
     * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
     *
     * Use `.set()` method to specify which values to update.
     *
     * See docs: {@link https://orm.drizzle.team/docs/update}
     *
     * @param table The table to update.
     *
     * @example
     *
     * ```ts
     * // Update all rows in the 'cars' table
     * await db.update(cars).set({ color: 'red' });
     *
     * // Update rows with filters and conditions
     * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
     * ```
     */
    update<TTable extends SingleStoreTable>(table: TTable): SingleStoreUpdateBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
    /**
     * Creates an insert query.
     *
     * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert}
     *
     * @param table The table to insert into.
     *
     * @example
     *
     * ```ts
     * // Insert one row
     * await db.insert(cars).values({ brand: 'BMW' });
     *
     * // Insert multiple rows
     * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
     * ```
     */
    insert<TTable extends SingleStoreTable>(table: TTable): SingleStoreInsertBuilder<TTable, TQueryResult, TPreparedQueryHKT>;
    /**
     * Creates a delete query.
     *
     * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
     *
     * See docs: {@link https://orm.drizzle.team/docs/delete}
     *
     * @param table The table to delete from.
     *
     * @example
     *
     * ```ts
     * // Delete all rows in the 'cars' table
     * await db.delete(cars);
     *
     * // Delete rows with filters and conditions
     * await db.delete(cars).where(eq(cars.color, 'green'));
     * ```
     */
    delete<TTable extends SingleStoreTable>(table: TTable): SingleStoreDeleteBase<TTable, TQueryResult, TPreparedQueryHKT>;
    execute<T extends {
        [column: string]: any;
    } = ResultSetHeader>(query: SQLWrapper | string): Promise<SingleStoreQueryResultKind<TQueryResult, T>>;
    $cache: {
        invalidate: Cache['onMutate'];
    };
    transaction<T>(transaction: (tx: SingleStoreTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>, config?: SingleStoreTransactionConfig) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
}
export type SingleStoreWithReplicas<Q> = Q & {
    $primary: Q;
    $replicas: Q[];
};
export declare const withReplicas: <Q extends SingleStoreDriverDatabase>(primary: Q, replicas: [Q, ...Q[]], getReplica?: (replicas: Q[]) => Q) => SingleStoreWithReplicas<Q>;
