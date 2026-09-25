import { sql } from 'kysely';

function escapeJsonKey(key: string): string {
	// The key is embedded in a SQL string literal; SQLite only needs '' escaping.
	return key.replace(/'/g, "''");
}

/*
 * These use SQLite's `->>` operator (3.38+) with the key as a plain object
 * label, like the Postgres helpers. `json_extract(data, '$.key')` would parse
 * the key as a JSON path, so a top-level field such as `release.version` would
 * be read as a nested path instead.
 */

/**
 * Extracts a text field from the JSON `data` column in SQLite.
 */
export function jsonTextField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedKey = escapeJsonKey(key);
	return sql<string>`data->>'${sql.raw(escapedKey)}'`;
}

/**
 * Extracts a number field from the JSON `data` column in SQLite.
 * Casts the result to REAL for numeric operations.
 */
export function jsonNumberField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedKey = escapeJsonKey(key);
	return sql<number>`CAST(data->>'${sql.raw(escapedKey)}' AS REAL)`;
}

/**
 * Extracts a boolean field from the JSON `data` column in SQLite.
 * SQLite returns JSON booleans as the integers 1/0, so compare against 1/0.
 */
export function jsonBooleanField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedKey = escapeJsonKey(key);
	return sql<boolean>`data->>'${sql.raw(escapedKey)}'`;
}

/**
 * Extracts a timestamp/date field from the JSON `data` column in SQLite.
 * SQLite stores dates as ISO8601 text strings; this extracts them as-is.
 * Date comparisons will work correctly with ISO8601 formatted strings.
 */
export function jsonTimestampField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedKey = escapeJsonKey(key);
	return sql<Date>`data->>'${sql.raw(escapedKey)}'`;
}
