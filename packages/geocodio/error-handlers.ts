import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GeocodioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Only a GET is replayed after a 5xx, a timeout or a dropped connection. A
 * batch POST can bill up to 10,000 lookups that may already have run, and a
 * DELETE that landed would answer 404 on the replay.
 */
function isReplayable(error: Error): boolean {
	const method =
		error instanceof ApiError
			? error.request.method
			: error instanceof GeocodioAPIError
				? error.method
				: undefined;
	return method === 'GET';
}

/**
 * Geocodio documents 403 for a bad key, 422 for a query it cannot use, 429 for
 * the rate limit and 404 for a missing list or job. A live probe with a bad key
 * answered **403**, not 401, with `{"error":"Invalid API key"}`.
 * Reference: https://www.geocod.io/docs/
 */
export const errorHandlers = {
	// Core's request() already retried the 429, honouring Retry-After, so this
	// handler does not retry again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is the documented answer for a missing or invalid key, not 401.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// An address Geocodio could not use, or a body a zod schema refused.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A list or job that is not there. A retry asks for the same ID.
	NOT_FOUND: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: isReplayable(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries: isReplayable(error) ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: isReplayable(error) ? 2 : 0,
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
