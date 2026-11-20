import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isAuthFailure,
	isBadgeLock,
	SimpleanalyticsAPIError,
	statusOf,
} from './client';

/** The request method, from core's ApiError or this plugin's error. */
function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	if (error instanceof SimpleanalyticsAPIError) return error.method;
	return undefined;
}

/**
 * Status codes and body flags: https://docs.simpleanalytics.com/api/stats
 *
 * Two things make this map different from most plugins:
 *
 * - A failure usually arrives as HTTP 400 (or 503 from Export) with
 *   `{ ok: false, error }`. A non-2xx answer stays core's `ApiError`; a 200
 *   that says `ok: false` becomes a `SimpleanalyticsAPIError` with no status
 *   and falls to DEFAULT, which does not retry.
 * - An invalid key retried twenty times in fifteen minutes locks it for up to
 *   fifteen minutes, so nothing here retries an auth failure.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// A 429 comes from the contains-search rate limit, which documents a
		// Retry-After header. The read is safe to replay.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError || error instanceof SimpleanalyticsAPIError
					? error.retryAfter
					: undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A bad key, a locked key, or a key without access to this website. The
	// retry budget matters: twenty failures in fifteen minutes lock the key.
	AUTH_ERROR: {
		match: (error: Error) => isAuthFailure(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 423: a Free-plan website is locked because its Simple Analytics badge is
	// missing. Only the site owner can fix that.
	PERMISSION_ERROR: {
		match: (error: Error) => isBadgeLock(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such route. 400 with `ok: false` reaches DEFAULT instead.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A malformed parameter: a field name the API does not know, a bad date, a
	// timezone it does not recognise. Re-sending cannot change the answer.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx from the API is worth replaying once: every route here is a read
	// except websites.add, which is gated on the method.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. Caller keys come first so a
 * handler they added actually runs.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) {
			merged[name as keyof CorsairErrorHandler] = entry;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
