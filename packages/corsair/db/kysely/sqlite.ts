import { sql } from 'kysely';

function escapeJsonPath(path: string): string {
	// Escape single quotes and ensure path is safe for SQLite json_extract
	return path.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

/**
 * Extracts a text field from the JSON `data` column in SQLite.
 * Uses json_extract for JSON value extraction.
 */
export function jsonTextField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<string>`json_extract(data, '$.${sql.raw(escapedPath)}')`;
}

/**
 * Extracts a number field from the JSON `data` column in SQLite.
 * Casts the result to REAL for numeric operations.
 */
export function jsonNumberField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<number>`CAST(json_extract(data, '$.${sql.raw(escapedPath)}') AS REAL)`;
}

/**
 * Extracts a boolean field from the JSON `data` column in SQLite.
 * SQLite stores booleans as 0/1 in JSON, so we extract and compare.
 */
export function jsonBooleanField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<boolean>`json_extract(data, '$.${sql.raw(escapedPath)}')`;
}

/**
 * Extracts a timestamp/date field from the JSON `data` column in SQLite.
 * SQLite stores dates as ISO8601 text strings; this extracts them as-is.
 * Date comparisons will work correctly with ISO8601 formatted strings.
 */
export function jsonTimestampField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<Date>`json_extract(data, '$.${sql.raw(escapedPath)}')`;
}
