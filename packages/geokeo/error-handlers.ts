import type { CorsairErrorHandler } from 'corsair/core';
import { GEOKEO_STATUS, GeokeoAPIError } from './client';

/**
 * Geokeo answers HTTP 200 for every failure and puts the truth in `status`, so
 * every handler reads the code rather than the status line. The documented
 * codes are `ok`, `INVALID_REQUEST`, `ACCESS_DENIED`, `OVER_QUERY_LIMIT` and
 * `ZERO_RESULTS`. `ZERO_RESULTS` never reaches a handler: it is a valid answer
 * that is not charged, and the client returns it.
 * Reference: https://geokeo.com/documentation.php
 */
export const errorHandlers = {
	// The daily allowance is used up. A retry with the same key cannot help until
	// the quota resets, so this sits before anything that would retry a 429.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof GeokeoAPIError && error.isQuotaError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A refused key, or an IP or referrer restriction. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof GeokeoAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A required parameter that was missing or invalid.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			return (
				error.name === 'ZodError' ||
				(error instanceof GeokeoAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A real 429, which only a proxy in front of Geokeo would send.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof GeokeoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof GeokeoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A real 5xx, which only a proxy would send. Every call here is a read, so a
	// replay is safe.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof GeokeoAPIError && (error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof GeokeoAPIError && error.timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GeokeoAPIError && error.transport,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Any other code Geokeo might add. There is nothing to retry against.
	UNKNOWN_STATUS_ERROR: {
		match: (error: Error) =>
			error instanceof GeokeoAPIError &&
			error.code !== undefined &&
			error.code !== GEOKEO_STATUS.OK,
		handler: async () => ({ maxRetries: 0 }),
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
