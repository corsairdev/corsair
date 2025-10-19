import type { Cache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import type { ExtractTablesWithRelations, RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type SQL, type SQLWrapper } from "../sql/sql.js";
import type { SQLiteAsyncDialect, SQLiteSyncDialect } from "./dialect.js";
import { SQLiteDeleteBase, SQLiteInsertBuilder, SQLiteSelectBuilder, SQLiteUpdateBuilder } from "./query-builders/index.js";
import type { DBResult, Result, SQLiteSession, SQLiteTransaction, SQLiteTransactionConfig } from "./session.js";
import type { SQLiteTable } from "./table.js";
import { WithSubquery } from "../subquery.js";
import type { DrizzleTypeError } from "../utils.js";
import { SQLiteCountBuilder } from "./query-builders/count.js";
import { RelationalQueryBuilder } from "./query-builders/query.js";
import type { SelectedFields } from "./query-builders/select.types.js";
import type { WithBuilder } from "./subquery.js";
import type { SQLiteViewBase } from "./view-base.js";
export declare class BaseSQLiteDatabase<TResultKind extends 'sync' | 'async', TRunResult, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>> {
    private resultKind;
    static readonly [entityKind]: string;
    readonly _: {
        readonly schema: TSchema | undefined;
        readonly fullSchema: TFullSchema;
        readonly tableNamesMap: Record<string, string>;
    };
    query: TFullSchema extends Record<string, never> ? DrizzleTypeError<'Seems like the schema generic is missing - did you forget to add it to your DB type?'> : {
        [K in keyof TSchema]: RelationalQueryBuilder<TResultKind, TFullSchema, TSchema, TSchema[K]>;
    };
    constructor(resultKind: TResultKind, 
    /** @internal */
    dialect: {
        sync: SQLiteSyncDialect;
        async: SQLiteAsyncDialect;
    }[TResultKind], 
    /** @internal */
    session: SQLiteSession<TResultKind, TRunResult, TFullSchema, TSchema>, schema: RelationalSchemaConfig<TSchema> | undefined);
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
    $count(source: SQLiteTable | SQLiteViewBase | SQL | SQLWrapper, filters?: SQL<unknown>): SQLiteCountBuilder<SQLiteSession<TResultKind, TRunResult, TFullSchema, TSchema>>;
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
            (): SQLiteSelectBuilder<undefined, TResultKind, TRunResult>;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, TResultKind, TRunResult>;
        };
        selectDistinct: {
            (): SQLiteSelectBuilder<undefined, TResultKind, TRunResult>;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, TResultKind, TRunResult>;
        };
        update: <TTable extends SQLiteTable>(table: TTable) => SQLiteUpdateBuilder<TTable, TResultKind, TRunResult>;
        insert: <TTable extends SQLiteTable>(into: TTable) => SQLiteInsertBuilder<TTable, TResultKind, TRunResult>;
        delete: <TTable extends SQLiteTable>(from: TTable) => SQLiteDeleteBase<TTable, TResultKind, TRunResult>;
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
    select(): SQLiteSelectBuilder<undefined, TResultKind, TRunResult>;
    select<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, TResultKind, TRunResult>;
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
     *
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
    selectDistinct(): SQLiteSelectBuilder<undefined, TResultKind, TRunResult>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, TResultKind, TRunResult>;
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
     *
     * // Update with returning clause
     * const updatedCar: Car[] = await db.update(cars)
     *   .set({ color: 'red' })
     *   .where(eq(cars.id, 1))
     *   .returning();
     * ```
     */
    update<TTable extends SQLiteTable>(table: TTable): SQLiteUpdateBuilder<TTable, TResultKind, TRunResult>;
    $cache: {
        invalidate: Cache['onMutate'];
    };
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
     *
     * // Insert with returning clause
     * const insertedCar: Car[] = await db.insert(cars)
     *   .values({ brand: 'BMW' })
     *   .returning();
     * ```
     */
    insert<TTable extends SQLiteTable>(into: TTable): SQLiteInsertBuilder<TTable, TResultKind, TRunResult>;
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
     *
     * // Delete with returning clause
     * const deletedCar: Car[] = await db.delete(cars)
     *   .where(eq(cars.id, 1))
     *   .returning();
     * ```
     */
    delete<TTable extends SQLiteTable>(from: TTable): SQLiteDeleteBase<TTable, TResultKind, TRunResult>;
    run(query: SQLWrapper | string): DBResult<TResultKind, TRunResult>;
    all<T = unknown>(query: SQLWrapper | string): DBResult<TResultKind, T[]>;
    get<T = unknown>(query: SQLWrapper | string): DBResult<TResultKind, T>;
    values<T extends unknown[] = unknown[]>(query: SQLWrapper | string): DBResult<TResultKind, T[]>;
    transaction<T>(transaction: (tx: SQLiteTransaction<TResultKind, TRunResult, TFullSchema, TSchema>) => Result<TResultKind, T>, config?: SQLiteTransactionConfig): Result<TResultKind, T>;
}
export type SQLiteWithReplicas<Q> = Q & {
    $primary: Q;
    $replicas: Q[];
};
export declare const withReplicas: <TResultKind extends "sync" | "async", TRunResult, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig, Q extends BaseSQLiteDatabase<TResultKind, TRunResult, TFullSchema, TSchema extends Record<string, unknown> ? ExtractTablesWithRelations<TFullSchema> : TSchema>>(primary: Q, replicas: [Q, ...Q[]], getReplica?: (replicas: Q[]) => Q) => SQLiteWithReplicas<Q>;
