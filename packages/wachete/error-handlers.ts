import type { CorsairErrorHandler } from 'corsair/core';
import { WacheteAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WacheteAPIError ? error.status : undefined;
}

/**
 * Wachete answers `{ message, code }`, and both a missing header and a bad
 * token are 401 `Unauthorized`. The token is obtained by a separate login call,
 * which the plugin performs itself, so an expired token surfaces as an auth
 * error rather than being silently retried against the same credential.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WacheteAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WacheteAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401, Unauthorized, or 403 Forbidden: the token is missing, expired or
	// belongs to another account.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WacheteAPIError &&
			(error.isAuthError || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the monitor, folder or notification is gone.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creating a monitor, moving folders and deleting
	// are not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WacheteAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
