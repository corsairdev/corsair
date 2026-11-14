import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isKeenAuthError,
	isKeenQueryIncomplete,
	isKeenRateLimit,
	KeenAPIError,
} from './client';

// Keen's HTTP errors arrive as core's ApiError; KeenAPIError is a request that
// got no answer, so it has no status.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Keen documents nine statuses and an error code on each JSON failure. The rate
// limit is per endpoint category: 200 a minute for extractions, and per project
// rather than per key. Reference: https://keen.io/docs/api/
export const errorHandlers = {
	// A 429 blocks every request of that category for the next minute, so the
	// delay is real and the retry has to wait it out. Keen sends no Retry-After
	// header, which is why `initialRetryDelay` is the minute itself.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isKeenRateLimit(error),
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError && error.retryAfter !== undefined
					? error.retryAfter
					: 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// `InvalidApiKeyError` on a 401. The client keeps Keen's message, which
	// quotes the key, off the error, so nothing here has to hide it.
	AUTH_ERROR: {
		match: (error: Error) => isKeenAuthError(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a valid key that is not allowed to make this call: a write key on a
	// read, a read key on a write, or a key without the permission.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A query that runs past Keen's five minute ceiling is stopped and answered
	// 504 `QueryIncompleteError`. The same query sent again is likely to take as
	// long, and the caller can narrow the timeframe instead.
	QUERY_TIMEOUT_ERROR: {
		match: (error: Error) => isKeenQueryIncomplete(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a malformed analysis and 404 an unknown project, collection, saved
	// query or dataset. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500 is Keen's own failure and 503 its outage. A read is safe to replay. A
	// write is not: a 500 after an event batch may have stored part of it, and a
	// second send would record those events twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Keen. TIMEOUT sits first
	// because a timeout is also a transport failure, and the two differ in how
	// many attempts a query is worth.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KeenAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KeenAPIError && error.method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof KeenAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KeenAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
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
