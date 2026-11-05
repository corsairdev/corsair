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

/**
 * Issues a SerpApi request under the plugin's API key.
 *
 * `T` is intentionally unconstrained: every call site supplies its own
 * precise response type (a per-operation output type, or
 * `SerpapiSearchResponse` via `serpapiSearch` below), so a bound here would
 * only narrow what callers are allowed to ask for without adding safety.
 */
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
	options: Pick<SerpapiRequestOptions, 'timeout'> = {},
): Promise<SerpapiSearchResponse> {
	const result = await serpapiCall<SerpapiSearchResponse>(ctx, '/search', {
		query: compactQuery({ ...query, engine }),
		timeout: options.timeout,
	});
	return rejectSerpapiError(result);
}

export function rejectSerpapiError<T extends { error?: string }>(result: T): T {
	if (typeof result.error === 'string' && result.error.trim() !== '') {
		throw new Error(result.error);
	}
	return result;
}

export function compactQuery<
	T extends Record<string, string | number | boolean | undefined>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		if (typeof value === 'string' && value.trim() === '') continue;
		(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
