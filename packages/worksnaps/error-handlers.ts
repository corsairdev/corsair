import type { CorsairErrorHandler } from 'corsair/core';
import { WorksnapsAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WorksnapsAPIError ? error.status : undefined;
}

/**
 * The handlers work from the status. The one distinction worth making is 403
 * against 401: the docs say privileged calls such as user creation need a
 * **partner token**, so a 403 there means a normal user's key was used rather
 * than that the key is bad. None of the 4xx cases is retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WorksnapsAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WorksnapsAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the token is missing, wrong or has been regenerated.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof WorksnapsAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: a normal token on a partner-only call, such as creating a user.
	PARTNER_TOKEN_REQUIRED_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, plus a ZodError from the input schema.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: logging time, creating a user and deleting are
	// not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WorksnapsAPIError &&
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
