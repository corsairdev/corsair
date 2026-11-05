import type { NextDNSRequestOptions } from '../client';
import { makeNextDNSRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type NextDNSCallContext = { key: string };

/**
 * Issues a NextDNS request under the plugin's API key. `T` is left
 * unconstrained deliberately: every one of the 71 endpoints supplies its
 * own precise response type at the call site (e.g.
 * `nextDNSCall<{ data: NextDNSProfile }>(...)`), so a bound here would only
 * ever be satisfied trivially and add nothing - the real type safety comes
 * from each call site's explicit generic, not from this wrapper.
 */
export async function nextDNSCall<T>(
	ctx: NextDNSCallContext,
	path: string,
	options: NextDNSRequestOptions = {},
): Promise<T> {
	return await makeNextDNSRequest<T>(path, ctx.key, options);
}

/** Drops keys whose value is `undefined`. */
function compact<T extends Record<string, unknown>>(obj: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}

/** Drops keys whose value is `undefined`, for query strings. */
export function compactQuery<
	T extends Record<string, string | number | boolean | undefined>,
>(query: T): T {
	return compact(query);
}

/** Drops keys whose value is `undefined`, for request bodies. */
export function compactBody<T extends Record<string, unknown>>(body: T): T {
	return compact(body);
}
