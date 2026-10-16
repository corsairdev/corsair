import type { CorsairErrorHandler } from 'corsair/core';
import { ContextDevAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ContextDevAPIError ? error.status : undefined;
}

// https://docs.context.dev/scrape/timeouts-and-errors
export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			statusOf(error) === 400 ||
			statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ContextDevAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Also covers USAGE_EXCEEDED: the key has no credits left.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The request's own deadline passed; repeating it would hit the same limit.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 || /timed out|aborted/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
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
