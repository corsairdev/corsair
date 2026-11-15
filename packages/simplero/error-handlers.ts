import type { CorsairErrorHandler } from 'corsair/core';
import { SimpleroAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SimpleroAPIError ? error.status : undefined;
}

/**
 * Status codes: https://simplero.com/api/v2/reference/openapi.json
 *
 * Simplero documents no rate limit, so a 429 comes from a gateway. A 503 can
 * mean the idempotency store could not be checked, in which case the action did
 * not run and the same key may be retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// The gateway refused the request before Simplero saw it, so any method
		// is safe to replay.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SimpleroAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 with `{ "error": "Bad API key" }`: the key is missing or not recognised.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SimpleroAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the account may not perform this change. With an Idempotency-Key it
	// can also mean permissions changed after the original request, in which
	// case the original may already have taken effect.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof SimpleroAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such record, or one that belongs to another account. 409: a
	// conflict, or with an Idempotency-Key a request still in progress. 422: a
	// field failed validation. None improves on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 404 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying only on a read: a failed write may already have
	// landed, and Simplero's idempotency protection is opt-in per request.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SimpleroAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
