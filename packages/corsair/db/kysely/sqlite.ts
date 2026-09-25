import { sql } from 'kysely';

function escapeJsonKey(key: string): string {
	// A quoted path label reads the key as one literal top-level field, even when
	// it contains `.` or `[` or starts with `$` (which `->>` would otherwise parse
	// as a path). Inside the quotes `\` and `"` are backslash-escaped, and the
	// whole path sits in a SQL string literal, so `'` becomes `''`.
	const label = key.replace(/[\\"]/g, '\\$&');
	return `$."${label}"`.replace(/'/g, "''");
}

/*
 * These use SQLite's `->>` operator (3.38+) with a quoted `$."key"` path, so the
 * key is always one top-level field, like the Postgres `->>` helpers. An
 * unquoted `$.key` path would read `release.version` as a nested field.
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
