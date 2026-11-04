import type { CorsairErrorHandler } from 'corsair/core';
import { GumroadAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (!(error instanceof GumroadAPIError)) return undefined;
	return error.status;
}

// The framework sleeps headersRetryAfterMs verbatim with no cap or jitter, so
// the Retry-After header is capped here and jitter is added before it is
// returned.
function cappedRetryAfterMs(
	retryAfter: number | undefined,
): number | undefined {
	if (retryAfter === undefined) return undefined;
	return Math.min(retryAfter, 60_000) + Math.floor(Math.random() * 250);
}

// Status codes and the error envelope: https://gumroad.com/api ("API Errors").
// Gumroad documents no rate limits for these endpoints, so a 429 is treated
// as transient; everything else fails fast or is classified by status alone
// because 401 bodies arrive empty.
export const errorHandlers = {
	// 400: a required parameter was missing; a retry resends the same ones.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token lacks the scope this endpoint needs (view_sales and
	// friends); waiting does not grant it.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: "the parameters were valid but request failed".
	REQUEST_FAILED_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof GumroadAPIError
					? cappedRetryAfterMs(error.retryAfter)
					: undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The API is free to call, so a replayed GET is uncharged and the reads
	// are idempotent; licenses.verify is a POST that increments the license
	// use counter and is never replayed.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) =>
			error instanceof GumroadAPIError && error.method === 'GET'
				? {
						maxRetries: 2,
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
