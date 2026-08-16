import type { DopplerRequestOptions } from '../client';
import { makeDopplerRequest, makeDopplerShareRequest } from '../client';

/**
 * Minimal structural view of the plugin context these helpers need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type DopplerCallContext = { key: string };

/** Issues a request against the documented REST v3 API. */
export async function dopplerCall<T>(
	ctx: DopplerCallContext,
	endpoint: string,
	options: DopplerRequestOptions = {},
): Promise<T> {
	return await makeDopplerRequest<T>(endpoint, ctx.key, options);
}

/** Issues a request against Doppler Share (`/v1/share/...`). */
export async function dopplerShareCall<T>(
	ctx: DopplerCallContext,
	endpoint: string,
	options: DopplerRequestOptions = {},
): Promise<T> {
	return await makeDopplerShareRequest<T>(endpoint, ctx.key, options);
}

/** Drops keys whose value is `undefined`, for both bodies and query strings. */
export function compact<T extends Record<string, unknown | undefined>>(
	obj: T,
): T {
	const out = {} as T;
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined) (out as Record<string, unknown>)[key] = value;
	}
	return out;
}
