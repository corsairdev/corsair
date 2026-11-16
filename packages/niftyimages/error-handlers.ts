import type { CorsairErrorHandler } from 'corsair/core';
import { NiftyimagesAPIError } from './client';

// NiftyImages answers a bad key with a 401 and a `{ message }` body, and a wrong
// path with a 404 HTML page. Neither is retryable, and every route here is a
// read, so a 5xx is the only case worth another attempt.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NiftyimagesAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NiftyimagesAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 is a malformed date, and a 404 an HTML page for a path that does not
	// exist. Both need the caller to change something.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NiftyimagesAPIError &&
				(error.status === 400 || error.status === 404)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every wrapped route is a GET, so a 5xx can be replayed safely.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NiftyimagesAPIError && (error.status ?? 0) >= 500,
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
