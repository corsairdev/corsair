import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * An ApiError carries the real HTTP status, so only the status decides its
 * route. Message matching is for errors that never reached Hex (no status):
 * a 504 whose body says "rate limit" must not be retried as a 429.
 */
function matches(
	error: Error,
	statuses: readonly number[],
	phrases: readonly string[],
): boolean {
	if (error instanceof ApiError) return statuses.includes(error.status);
	const msg = error.message.toLowerCase();
	return phrases.some((phrase) => msg.includes(phrase));
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			matches(error, [429], ['too many requests', 'rate limit']),
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			matches(
				error,
				[401, 403],
				['unauthorized', 'forbidden', 'invalid_auth', 'insufficient access'],
			),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => matches(error, [404], ['not found']),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			matches(error, [422], ['validation', 'unprocessable']),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			matches(error, [400], ['bad request', 'invalid input data']),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVICE_UNAVAILABLE_ERROR: {
		match: (error: Error) => matches(error, [503], ['service unavailable']),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
