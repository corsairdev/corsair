import type { LobQuery } from '../client';

/** A copy of `value` without `keys`: path IDs and header-only fields. */
export function omit<T extends object, K extends keyof T>(
	value: T,
	...keys: K[]
): Omit<T, K> {
	const copy = { ...value };
	for (const key of keys) delete copy[key];
	return copy;
}

/**
 * List filters go out as the query as they are: core writes arrays as
 * repeated keys (`include=total_count`, `size=4x6&size=6x9`) and objects as
 * `date_created[gt]=...`, `metadata[key]=...`, `sort_by[date_created]=asc`.
 */
export function listQuery<T extends object>(parsed: T): LobQuery {
	return { ...parsed } as LobQuery;
}
