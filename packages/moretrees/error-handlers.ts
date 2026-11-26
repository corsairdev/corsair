import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { getRequestFacts } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function isReplayable(error: Error): boolean {
	return getRequestFacts(error)?.replayable === true;
}

/**
 * Response codes: https://moretrees.eco/learn/user-guides/api (200, 201,
 * 400, 401, 403, 404, 406, 429, 500). The docs define no rate-limit window.
 */
export const errorHandlers = {
	// Core's request() already retried the 429 three times, honouring
	// Retry-After, so the handler does not retry again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// 401 missing/invalid key, 403 forbidden (identity known to the server).
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed request, 404 unknown resource, 405 wrong method, 406
	// unacceptable content type. The same request fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 405 ||
				status === 406
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads are replayed; a planting is never replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			isReplayable(error) && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, timeout) has no status; reads replay.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			isReplayable(error) && !(error instanceof ApiError),
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
