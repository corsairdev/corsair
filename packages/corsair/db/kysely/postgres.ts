import { sql } from 'kysely';

function escapeJsonPath(path: string): string {
	return path.replace(/'/g, "''");
}

export function jsonbTextField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<string>`data->>'${sql.raw(escapedPath)}'`;
}

export function jsonbNumberField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<number>`(data->>'${sql.raw(escapedPath)}')::numeric`;
}

export function jsonbBooleanField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<boolean>`(data->>'${sql.raw(escapedPath)}')::boolean`;
}

export function jsonbTimestampField<Data extends Record<string, unknown>>(
	key: Extract<keyof Data, string>,
) {
	const escapedPath = escapeJsonPath(key);
	return sql<Date>`(data->>'${sql.raw(escapedPath)}')::timestamptz`;
}
