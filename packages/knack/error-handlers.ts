import type { CorsairErrorHandler } from 'corsair/core';
import { KnackAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof KnackAPIError ? error.status : undefined;
}

/**
 * Knack documents a fixed ceiling of 10 requests a second, and says a caller
 * should wait under a second before retrying. A daily plan limit answers the
 * same 429, so the caller's allowance may be spent: the plugin retries the
 * short window only, and stops as soon as the reset is far away.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Status only: the message carries Knack's own text, and a rejected
		// write that mentions "429" must not be retried as a rate limit.
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof KnackAPIError ? error.retryAfter : undefined;
			// A reset more than a minute out is the daily allowance rather than
			// the one-second window, and no retry inside this call restores it.
			if (retryAfter !== undefined && retryAfter > 60_000) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				headersRetryAfterMs: retryAfter ?? 1_000,
			};
		},
	},
	// 401 with the plain-text body `Invalid API Key`, and 403 for an app whose
	// plan does not include API access. Neither improves on a retry.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a rejected field or a malformed record id, both of which the same
	// request would fail again. A schema failure never reached Knack.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: Knack documents no idempotency key, and a write
	// that failed this way may already have been applied.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof KnackAPIError &&
			error.method === 'GET' &&
			error.status >= 500,
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
 * last. A caller's handlers go first so one they add for a status no builtin
 * covers actually runs; keeping the builtin order would let `DEFAULT` claim the
 * error before their entry is tried.
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
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
