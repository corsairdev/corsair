import type { CorsairErrorHandler } from 'corsair/core';
import { GENDER_API_ERRNO, genderApiErrorInfo } from './client';

/**
 * Gender API reports its failures as `errno` inside a 200, not as a status, so
 * every handler reads the code rather than the status. The documented codes are
 * 10, 11, 20, 21, 30, 40 and 500.
 * Reference: https://gender-api.com/en/api-docs
 */
export const errorHandlers = {
	// A used-up quota. It resets on its own, so a retry with the same key either
	// waits out the month or fails again.
	LIMIT_REACHED: {
		match: (error: Error) => genderApiErrorInfo(error).isLimitReached,
		handler: async () => ({ maxRetries: 0 }),
	},
	// An unknown key, or none sent. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A country code, its count, a missing name, or more than 100 names.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || genderApiErrorInfo(error).isValidationError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `errno: 500` is their internal failure. A read changed nothing, so a retry
	// is safe.
	SERVER_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).isServerError,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Any other failure the body reported on a 2xx. There is nothing to retry.
	BODY_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).bodyError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A real 429 only arrives from a proxy, since Gender API uses errno 30.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).status === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: genderApiErrorInfo(error).retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => genderApiErrorInfo(error).transport,
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

/** The codes this plugin knows about, for callers that want to branch on them. */
export { GENDER_API_ERRNO };
