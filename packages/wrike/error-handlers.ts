import type { CorsairErrorHandler } from 'corsair/core';
import { WrikeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WrikeAPIError ? error.status : undefined;
}

/**
 * Errors: https://developers.wrike.com/docs/errors-api-reference-v4
 *
 * The body is `{ error, errorDescription }`. Both a missing header and a bad
 * token are a 401 `not_authorized`, so the description is what tells them
 * apart — and both mean the credential needs fixing.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WrikeAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WrikeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 not_authorized, whether the header was missing or the token is bad.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WrikeAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 or access_denied: the token is valid but its scope does not cover the
	// call, or the user's role does not.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof WrikeAPIError && error.isForbidden,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid_parameter, 409 for a non-empty folder deleted without
	// `recursive`, and a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creating a task or logging time is not
	// repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WrikeAPIError &&
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
