import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Retry policy.
 *
 * Every handler here returns `maxRetries: 0`, deliberately:
 *
 * 1. `corsair/http`'s `request()` already runs its own rate-limit retry loop
 *    and honours `Retry-After`, so a 429 has been retried before it ever
 *    surfaces to these handlers. Retrying again multiplies the wait and burns
 *    the monthly quota that `account.usage` reports.
 * 2. The binder's retry path in `packages/corsair/core/endpoints/bind.ts`
 *    discards the value a successful retry returns and rethrows the original
 *    error, so a binder-level retry cannot turn a failure into a result — it
 *    only spends requests.
 *
 * The handlers still exist to classify failures and to surface the provider's
 * `Retry-After` to the caller.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			// The documented 429 body is `{"message": "API rate limit exceeded"}`.
			return error.message.toLowerCase().includes('rate limit');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			// The documented 401 body is `{"message": "Invalid API key"}`.
			return error.message.toLowerCase().includes('invalid api key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * 403 separates "this key is valid but your plan does not include this
	 * surface" from a bad key. The SQL API and the ASI project endpoints are
	 * sold separately from the retail packages.
	 */
	FORBIDDEN_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	/** Malformed hostname, bad DSL/SQL syntax, or an expired scroll cursor. */
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
