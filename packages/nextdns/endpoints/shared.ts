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

/** Issues a NextDNS request under the plugin's API key. */
export async function nextDNSCall<T>(
	ctx: NextDNSCallContext,
	path: string,
	options: NextDNSRequestOptions = {},
): Promise<T> {
	return await makeNextDNSRequest<T>(path, ctx.key, options);
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

/** Drops keys whose value is `undefined`, for request bodies. */
export function compactBody<T extends Record<string, unknown>>(body: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
