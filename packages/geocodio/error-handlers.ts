import type { CorsairErrorHandler } from 'corsair/core';
import { GeocodioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof GeocodioAPIError ? error.status : undefined;
}

/**
 * Geocodio documents 403 for a bad key, 422 for a query it cannot use, 429 for
 * the rate limit and 404 for a missing list or job. A live probe with a bad key
 * answered **403**, not 401, with `{"error":"Invalid API key"}`.
 * Reference: https://www.geocod.io/docs/
 */
export const errorHandlers = {
	// The documented rate limit. A retry with the same query costs another lookup,
	// so the attempt count stays low and Retry-After is honoured when present.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof GeocodioAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 403 is the documented answer for a missing or invalid key, not 401.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.isAuthError,
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
	// Every read here is safe to replay, and a 5xx changed nothing.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && (error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof GeocodioAPIError && error.transport,
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
