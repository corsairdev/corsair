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

/**
 * Percent-encodes a caller-supplied value before it is interpolated into a
 * URL path segment (a slug, a role name, a member id, ...). The shared
 * transport's own `{param}` substitution mechanism (`corsair/http`'s
 * `getUrl`) encodes for us when a path is built that way, but every route in
 * this plugin builds its path with a plain template literal instead, so
 * nothing upstream encodes it - an unencoded `/`, `?`, or `#` in a slug would
 * otherwise change which path segment (or query string) the request actually
 * addresses, not just look wrong.
 */
export function seg(value: string): string {
	return encodeURIComponent(value);
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
