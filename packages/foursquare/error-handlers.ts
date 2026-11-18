import type { CorsairErrorHandler } from 'corsair/core';
import { FoursquareAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof FoursquareAPIError ? error.status : undefined;
}

/**
 * Status codes: https://docs.foursquare.com/fsq-developers-places/reference/errors
 *
 * - `400` a bad parameter, or the missing version header
 * - `401` `Invalid request token`; `403` the information is restricted
 * - `404` the endpoint or place does not exist
 * - `409` the request cannot be completed as-is
 * - `500` retry later
 *
 * Every operation in this plugin is a GET, so a 5xx is always safe to replay.
 */
export const errorHandlers = {
	// Credits first: the same 429 status, but no retry can help, so it must be
	// matched before RATE_LIMIT_ERROR or the client would burn three attempts.
	CREDITS_EXHAUSTED_ERROR: {
		match: (error: Error) =>
			error instanceof FoursquareAPIError && error.isCreditExhausted,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof FoursquareAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof FoursquareAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A missing version header is reported as a 400 whose message says so, which
	// reads like an auth problem. It is a configuration error and never retries.
	VERSION_ERROR: {
		match: (error: Error) =>
			error instanceof FoursquareAPIError && error.isVersionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 is documented as "modify the request and retry", so the identical
	// request cannot succeed and is not replayed.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof FoursquareAPIError && (error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
