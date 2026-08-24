/**
 * Better Stack answers every resource in a JSON:API-ish envelope:
 *
 *   { "data": { "id": "123", "type": "monitor", "attributes": { ... } },
 *     "pagination": { "first": "...", "last": "...", "prev": null, "next": null } }
 *
 * Ids come back as strings even though every request parameter that references
 * an id is documented as an integer.
 */
/**
 * Mirrors the zod output type: only `id` is guaranteed. `type` and
 * `attributes` are declared nullable and optional so a resource parsed out of
 * a response stays assignable here without a cast.
 */
export type BetterstackResource<T = Record<string, unknown>> = {
	[key: string]: unknown;
	id: string;
	type?: string | null;
	attributes?: T | null;
	relationships?: Record<string, unknown> | null;
};

export type BetterstackPagination = {
	first?: string | null;
	last?: string | null;
	prev?: string | null;
	next?: string | null;
};

export type BetterstackSingle<T = Record<string, unknown>> = {
	data: BetterstackResource<T>;
};

export type BetterstackList<T = Record<string, unknown>> = {
	data: BetterstackResource<T>[];
	pagination?: BetterstackPagination;
};

/**
 * Interpolates path parameters, rejecting missing values rather than letting
 * "undefined" reach the URL as a literal segment.
 */
export function buildPath(
	template: string,
	values: Record<string, string | number | undefined>,
): string {
	return template.replace(/\{([a-z_]+)\}/g, (_match, name: string) => {
		const value = values[name];
		if (value === undefined || value === null || value === '') {
			throw new Error(
				`[betterstack] missing path parameter "${name}" for ${template}`,
			);
		}
		return encodeURIComponent(String(value));
	});
}

/** Shared list controls; both are documented on every paginated collection. */
export type PaginationInput = {
	page?: number;
	per_page?: number;
};

/**
 * Merges the caller's page controls into a collection's query string.
 *
 * The list envelope reports `pagination` as fully-formed URLs rather than
 * tokens, so a caller cannot resume from the response alone - the only way past
 * the first page is to send `page` on the next request. Every list handler
 * therefore routes its query through here. Unset controls stay `undefined` and
 * are dropped by `compactQuery`, so an unpaginated call is byte-identical to
 * what it sent before.
 */
export function withPagination<
	T extends Record<string, string | number | boolean | undefined>,
>(
	input: PaginationInput,
	query?: T,
): Record<string, string | number | boolean | undefined> {
	return { ...query, page: input.page, per_page: input.per_page };
}
