import type { CorsairErrorHandler } from 'corsair/core';
import { NasdaqAPIError } from './client';

// Nasdaq answers a bad key with a 400 QEAx01 body, not a 401, and its gateway
// answers a blocked route with a 403 HTML page. The handlers separate those two
// because one is fixable by the caller and the other is not.
export const errorHandlers = {
	// QEAx07 asks for a 30-second wait and QEAx06 is the daily cap. Only the
	// 30-second one can succeed on a retry; the daily cap cannot.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NasdaqAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof NasdaqAPIError && error.code === 'QEAx07' ? 2 : 0,
			retryStrategy: 'linear_4s' as const,
		}),
	},
	// QEAx01 is an unknown key and QEPx04 a missing one. Neither retries.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NasdaqAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The gateway answered 403 with no JSON at all. Retrying the same way gets
	// the same block, so this is reported rather than retried.
	BLOCKED_ERROR: {
		match: (error: Error) => error instanceof NasdaqAPIError && error.blocked,
		handler: async () => ({ maxRetries: 0 }),
	},
	// QESx06 is an expired cursor, which needs a fresh first page rather than a
	// repeat. A 404 route and a 400 filter both need the caller to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NasdaqAPIError &&
				!error.blocked &&
				(error.status === 400 || error.status === 404)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every wrapped route is a GET, so a 5xx can be replayed safely.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NasdaqAPIError &&
			!error.blocked &&
			(error.status ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys go first, then any builtin they did not name, then one DEFAULT.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
