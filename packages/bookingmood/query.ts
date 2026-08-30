const QUERY_KEYS = new Set(['select', 'limit', 'offset', 'order']);
const HAS_OPERATOR =
	/^(eq|neq|gt|gte|lt|lte|like|ilike|in|is|cs|cd|ov|fts|plfts|phfts|wfts)\./;

export type QueryValue = string | number | boolean | undefined;

export function toPostgrestValue(value: QueryValue): string | number | boolean {
	if (typeof value === 'string' && !HAS_OPERATOR.test(value)) {
		return `eq.${value}`;
	}
	return value as string | number | boolean;
}

export function toPostgrestQuery(
	input: Record<string, unknown> | undefined,
	mode: 'list' | 'filter',
): Record<string, QueryValue> {
	const query: Record<string, QueryValue> = {};
	if (!input) return query;
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined || value === null) continue;
		if (key === 'body' || key === 'data' || key === 'filters') continue;
		if (QUERY_KEYS.has(key) || mode === 'list') {
			query[key] =
				key === 'select' || key === 'order' || typeof value !== 'string'
					? (value as QueryValue)
					: toPostgrestValue(value as QueryValue);
			continue;
		}
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = toPostgrestValue(value);
		}
	}
	if (
		input.filters &&
		typeof input.filters === 'object' &&
		!Array.isArray(input.filters)
	) {
		for (const [key, value] of Object.entries(
			input.filters as Record<string, unknown>,
		)) {
			if (value === undefined || value === null) continue;
			if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean'
			) {
				query[key] = toPostgrestValue(value);
			}
		}
	}
	return query;
}

export function filterKeys(query: Record<string, QueryValue>): string[] {
	return Object.keys(query).filter((key) => !QUERY_KEYS.has(key));
}

export function requireFilter(
	query: Record<string, QueryValue>,
	resource: string,
): void {
	if (filterKeys(query).length === 0) {
		throw new Error(
			`Bookingmood ${resource} mutation requires at least one PostgREST filter (for example id=eq.<uuid>)`,
		);
	}
}

export function writeBody(
	input: Record<string, unknown>,
): Record<string, unknown> {
	if (
		input.body &&
		typeof input.body === 'object' &&
		!Array.isArray(input.body)
	) {
		return input.body as Record<string, unknown>;
	}
	if (
		input.data &&
		typeof input.data === 'object' &&
		!Array.isArray(input.data)
	) {
		return input.data as Record<string, unknown>;
	}
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (
			value === undefined ||
			key === 'filters' ||
			key === 'select' ||
			key === 'limit' ||
			key === 'offset' ||
			key === 'order' ||
			key === 'id'
		) {
			continue;
		}
		body[key] = value;
	}
	return body;
}

export function firstRow<T>(res: T | T[] | null | undefined): T | undefined {
	if (Array.isArray(res)) return res[0];
	return res ?? undefined;
}

export function asRows<T>(res: T | T[] | null | undefined): T[] {
	if (res == null) return [];
	return Array.isArray(res) ? res : [res];
}
