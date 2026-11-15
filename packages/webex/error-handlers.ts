import type { CorsairErrorHandler } from 'corsair/core';
import { WebexAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WebexAPIError ? error.status : undefined;
}

/**
 * Webex has no error codes: a failure is `{ message, errors, trackingId }`.
 * The distinction that matters is 401 (the token is missing or dead) from 403
 * (the token is alive but lacks the scope), since only the first needs a new
 * credential.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WebexAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WebexAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: no token, or an expired or revoked one.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WebexAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token works but the scope does not cover this call.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422, plus a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: posting a message reaches people, and deleting a
	// room is not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WebexAPIError &&
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
