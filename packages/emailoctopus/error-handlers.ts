import type { CorsairErrorHandler } from 'corsair/core';
import { EmailOctopusAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof EmailOctopusAPIError ? error.status : undefined;
}

// Status and type URLs: https://emailoctopus.com/api-documentation/v2#section/Errors
export const errorHandlers = {
	// The request was rejected, so retrying it cannot repeat a write.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof EmailOctopusAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof EmailOctopusAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 415 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// internal-error says a later retry can succeed. Only reads are replayed:
	// a failed write may already have been stored.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof EmailOctopusAPIError &&
			error.method === 'GET' &&
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
