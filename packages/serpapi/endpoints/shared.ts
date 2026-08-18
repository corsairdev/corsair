import type { SerpapiRequestOptions } from '../client';
import { makeSerpapiRequest } from '../client';
import type { SerpapiSearchResponse } from './types';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type SerpapiCallContext = { key: string };

/** Issues a SerpApi request under the plugin's API key. */
export async function serpapiCall<T>(
	ctx: SerpapiCallContext,
	path: string,
	options: SerpapiRequestOptions = {},
): Promise<T> {
	return await makeSerpapiRequest<T>(path, ctx.key, options);
}

/**
 * Nearly every one of this catalog's 48 operations is `GET /search` with a
 * different `engine` value - confirmed live for all 48 (see `SERPAPI-PLAN.md`)
 * by probing each candidate engine name and reading the resulting
 * validation error, which also confirmed each engine's primary required
 * parameter name. This is the shared entry point every per-engine wrapper
 * in this package calls.
 */
export async function serpapiSearch(
	ctx: SerpapiCallContext,
	engine: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<SerpapiSearchResponse> {
	return await serpapiCall<SerpapiSearchResponse>(ctx, '/search', {
		query: compactQuery({ ...query, engine }),
	});
}

/** Drops keys whose value is `undefined`. */
export function compactQuery<
	T extends Record<string, string | number | boolean | undefined>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
