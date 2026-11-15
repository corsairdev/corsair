import type { CorsairErrorHandler } from 'corsair/core';
import { CloroAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CloroAPIError ? error.status : undefined;
}

// https://cloro.dev/docs/guides/error-handling — non-2xx responses are not billed.
export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	// RATE_LIMIT_EXCEEDED clears within a second; CONCURRENCY_LIMIT_EXCEEDED
	// clears when a slot frees. Neither sends Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// INSUFFICIENT_CREDITS is the only 403.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof CloroAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timed-out attempt can still finish and bill; a retry would be a second charge.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 499 ||
			/timeout|timed out|aborted/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
