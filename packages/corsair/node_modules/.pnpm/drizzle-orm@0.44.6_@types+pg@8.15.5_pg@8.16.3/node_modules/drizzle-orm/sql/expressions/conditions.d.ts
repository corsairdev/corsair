import { type AnyColumn, Column, type GetColumnData } from "../../column.js";
import { Placeholder, SQL, type SQLChunk, type SQLWrapper } from "../sql.js";
export declare function bindIfParam(value: unknown, column: SQLWrapper): SQLChunk;
export interface BinaryOperator {
    <TColumn extends Column>(left: TColumn, right: GetColumnData<TColumn, 'raw'> | SQLWrapper): SQL;
    <T>(left: SQL.Aliased<T>, right: T | SQLWrapper): SQL;
    <T extends SQLWrapper>(left: Exclude<T, SQL.Aliased | Column>, right: unknown): SQL;
}
/**
 * Test that two values are equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is null, you may want to use
 * `isNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford
 * db.select().from(cars)
 *   .where(eq(cars.make, 'Ford'))
 * ```
 *
 * @see isNull for a way to test equality to NULL.
 */
export declare const eq: BinaryOperator;
/**
 * Test that two values are not equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is not null, you may want to use
 * `isNotNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars not made by Ford
 * db.select().from(cars)
 *   .where(ne(cars.make, 'Ford'))
 * ```
 *
 * @see isNotNull for a way to test whether a value is not null.
 */
export declare const ne: BinaryOperator;
/**
 * Combine a list of conditions with the `and` operator. Conditions
 * that are equal `undefined` are automatically ignored.
 *
 * ## Examples
 *
 * ```ts
 * db.select().from(cars)
 *   .where(
 *     and(
 *       eq(cars.make, 'Volvo'),
 *       eq(cars.year, 1950),
 *     )
 *   )
 * ```
 */
export declare function and(...conditions: (SQLWrapper | undefined)[]): SQL | undefined;
/**
 * Combine a list of conditions with the `or` operator. Conditions
 * that are equal `undefined` are automatically ignored.
 *
 * ## Examples
 *
 * ```ts
 * db.select().from(cars)
 *   .where(
 *     or(
 *       eq(cars.make, 'GM'),
 *       eq(cars.make, 'Ford'),
 *     )
 *   )
 * ```
 */
export declare function or(...conditions: (SQLWrapper | undefined)[]): SQL | undefined;
/**
 * Negate the meaning of an expression using the `not` keyword.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars _not_ made by GM or Ford.
 * db.select().from(cars)
 *   .where(not(inArray(cars.make, ['GM', 'Ford'])))
 * ```
 */
export declare function not(condition: SQLWrapper): SQL;
/**
 * Test that the first expression passed is greater than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made after 2000.
 * db.select().from(cars)
 *   .where(gt(cars.year, 2000))
 * ```
 *
 * @see gte for greater-than-or-equal
 */
export declare const gt: BinaryOperator;
/**
 * Test that the first expression passed is greater than
 * or equal to the second expression. Use `gt` to
 * test whether an expression is strictly greater
 * than another.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made on or after 2000.
 * db.select().from(cars)
 *   .where(gte(cars.year, 2000))
 * ```
 *
 * @see gt for a strictly greater-than condition
 */
export declare const gte: BinaryOperator;
/**
 * Test that the first expression passed is less than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lt(cars.year, 2000))
 * ```
 *
 * @see lte for less-than-or-equal
 */
export declare const lt: BinaryOperator;
/**
 * Test that the first expression passed is less than
 * or equal to the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lte(cars.year, 2000))
 * ```
 *
 * @see lt for a strictly less-than condition
 */
export declare const lte: BinaryOperator;
/**
 * Test whether the first parameter, a column or expression,
 * has a value from a list passed as the second argument.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford or GM.
 * db.select().from(cars)
 *   .where(inArray(cars.make, ['Ford', 'GM']))
 * ```
 *
 * @see notInArray for the inverse of this test
 */
export declare function inArray<T>(column: SQL.Aliased<T>, values: (T | Placeholder)[] | SQLWrapper): SQL;
export declare function inArray<TColumn extends Column>(column: TColumn, values: ReadonlyArray<GetColumnData<TColumn, 'raw'> | Placeholder> | SQLWrapper): SQL;
export declare function inArray<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, values: ReadonlyArray<unknown | Placeholder> | SQLWrapper): SQL;
/**
 * Test whether the first parameter, a column or expression,
 * has a value that is not present in a list passed as the
 * second argument.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by any company except Ford or GM.
 * db.select().from(cars)
 *   .where(notInArray(cars.make, ['Ford', 'GM']))
 * ```
 *
 * @see inArray for the inverse of this test
 */
export declare function notInArray<T>(column: SQL.Aliased<T>, values: (T | Placeholder)[] | SQLWrapper): SQL;
export declare function notInArray<TColumn extends Column>(column: TColumn, values: (GetColumnData<TColumn, 'raw'> | Placeholder)[] | SQLWrapper): SQL;
export declare function notInArray<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, values: (unknown | Placeholder)[] | SQLWrapper): SQL;
/**
 * Test whether an expression is NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have no discontinuedAt date.
 * db.select().from(cars)
 *   .where(isNull(cars.discontinuedAt))
 * ```
 *
 * @see isNotNull for the inverse of this test
 */
export declare function isNull(value: SQLWrapper): SQL;
/**
 * Test whether an expression is not NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have been discontinued.
 * db.select().from(cars)
 *   .where(isNotNull(cars.discontinuedAt))
 * ```
 *
 * @see isNull for the inverse of this test
 */
export declare function isNotNull(value: SQLWrapper): SQL;
/**
 * Test whether a subquery evaluates to have any rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column has a match in a cities
 * // table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     exists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see notExists for the inverse of this test
 */
export declare function exists(subquery: SQLWrapper): SQL;
/**
 * Test whether a subquery doesn't include any result
 * rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column doesn't match
 * // a row in the cities table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     notExists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see exists for the inverse of this test
 */
export declare function notExists(subquery: SQLWrapper): SQL;
/**
 * Test whether an expression is between two values. This
 * is an easier way to express range tests, which would be
 * expressed mathematically as `x <= a <= y` but in SQL
 * would have to be like `a >= x AND a <= y`.
 *
 * Between is inclusive of the endpoints: if `column`
 * is equal to `min` or `max`, it will be TRUE.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made between 1990 and 2000
 * db.select().from(cars)
 *   .where(between(cars.year, 1990, 2000))
 * ```
 *
 * @see notBetween for the inverse of this test
 */
export declare function between<T>(column: SQL.Aliased, min: T | SQLWrapper, max: T | SQLWrapper): SQL;
export declare function between<TColumn extends AnyColumn>(column: TColumn, min: GetColumnData<TColumn, 'raw'> | SQLWrapper, max: GetColumnData<TColumn, 'raw'> | SQLWrapper): SQL;
export declare function between<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, min: unknown, max: unknown): SQL;
/**
 * Test whether an expression is not between two values.
 *
 * This, like `between`, includes its endpoints, so if
 * the `column` is equal to `min` or `max`, in this case
 * it will evaluate to FALSE.
 *
 * ## Examples
 *
 * ```ts
 * // Exclude cars made in the 1970s
 * db.select().from(cars)
 *   .where(notBetween(cars.year, 1970, 1979))
 * ```
 *
 * @see between for the inverse of this test
 */
export declare function notBetween<T>(column: SQL.Aliased, min: T | SQLWrapper, max: T | SQLWrapper): SQL;
export declare function notBetween<TColumn extends AnyColumn>(column: TColumn, min: GetColumnData<TColumn, 'raw'> | SQLWrapper, max: GetColumnData<TColumn, 'raw'> | SQLWrapper): SQL;
export declare function notBetween<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, min: unknown, max: unknown): SQL;
/**
 * Compare a column to a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(like(cars.name, '%Turbo%'))
 * ```
 *
 * @see ilike for a case-insensitive version of this condition
 */
export declare function like(column: Column | SQL.Aliased | SQL, value: string | SQLWrapper): SQL;
/**
 * The inverse of like - this tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "ROver" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see like for the inverse condition
 * @see notIlike for a case-insensitive version of this condition
 */
export declare function notLike(column: Column | SQL.Aliased | SQL, value: string | SQLWrapper): SQL;
/**
 * Case-insensitively compare a column to a pattern,
 * which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * Unlike like, this performs a case-insensitive comparison.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(ilike(cars.name, '%Turbo%'))
 * ```
 *
 * @see like for a case-sensitive version of this condition
 */
export declare function ilike(column: Column | SQL.Aliased | SQL, value: string | SQLWrapper): SQL;
/**
 * The inverse of ilike - this case-insensitively tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "Rover" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see ilike for the inverse condition
 * @see notLike for a case-sensitive version of this condition
 */
export declare function notIlike(column: Column | SQL.Aliased | SQL, value: string | SQLWrapper): SQL;
/**
 * Test that a column or expression contains all elements of
 * the list passed as the second argument.
 *
 * ## Throws
 *
 * The argument passed in the second array can't be empty:
 * if an empty is provided, this method will throw.
 *
 * ## Examples
 *
 * ```ts
 * // Select posts where its tags contain "Typescript" and "ORM".
 * db.select().from(posts)
 *   .where(arrayContains(posts.tags, ['Typescript', 'ORM']))
 * ```
 *
 * @see arrayContained to find if an array contains all elements of a column or expression
 * @see arrayOverlaps to find if a column or expression contains any elements of an array
 */
export declare function arrayContains<T>(column: SQL.Aliased<T>, values: (T | Placeholder) | SQLWrapper): SQL;
export declare function arrayContains<TColumn extends Column>(column: TColumn, values: (GetColumnData<TColumn, 'raw'> | Placeholder) | SQLWrapper): SQL;
export declare function arrayContains<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, values: (unknown | Placeholder)[] | SQLWrapper): SQL;
/**
 * Test that the list passed as the second argument contains
 * all elements of a column or expression.
 *
 * ## Throws
 *
 * The argument passed in the second array can't be empty:
 * if an empty is provided, this method will throw.
 *
 * ## Examples
 *
 * ```ts
 * // Select posts where its tags contain "Typescript", "ORM" or both,
 * // but filtering posts that have additional tags.
 * db.select().from(posts)
 *   .where(arrayContained(posts.tags, ['Typescript', 'ORM']))
 * ```
 *
 * @see arrayContains to find if a column or expression contains all elements of an array
 * @see arrayOverlaps to find if a column or expression contains any elements of an array
 */
export declare function arrayContained<T>(column: SQL.Aliased<T>, values: (T | Placeholder) | SQLWrapper): SQL;
export declare function arrayContained<TColumn extends Column>(column: TColumn, values: (GetColumnData<TColumn, 'raw'> | Placeholder) | SQLWrapper): SQL;
export declare function arrayContained<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, values: (unknown | Placeholder)[] | SQLWrapper): SQL;
/**
 * Test that a column or expression contains any elements of
 * the list passed as the second argument.
 *
 * ## Throws
 *
 * The argument passed in the second array can't be empty:
 * if an empty is provided, this method will throw.
 *
 * ## Examples
 *
 * ```ts
 * // Select posts where its tags contain "Typescript", "ORM" or both.
 * db.select().from(posts)
 *   .where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']))
 * ```
 *
 * @see arrayContains to find if a column or expression contains all elements of an array
 * @see arrayContained to find if an array contains all elements of a column or expression
 */
export declare function arrayOverlaps<T>(column: SQL.Aliased<T>, values: (T | Placeholder) | SQLWrapper): SQL;
export declare function arrayOverlaps<TColumn extends Column>(column: TColumn, values: (GetColumnData<TColumn, 'raw'> | Placeholder) | SQLWrapper): SQL;
export declare function arrayOverlaps<T extends SQLWrapper>(column: Exclude<T, SQL.Aliased | Column>, values: (unknown | Placeholder)[] | SQLWrapper): SQL;
