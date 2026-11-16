import type { CorsairErrorHandler } from 'corsair/core';
import { StackAIAPIError } from './client';

// Core sleeps for the whole Retry-After before retrying. A longer wait than
// this (a quota window, for example) fails fast with the 429 instead.
export const MAX_RETRY_AFTER_MS = 60_000;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof StackAIAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof StackAIAPIError &&
				error.method === 'GET' &&
				(error.retryAfter ?? 0) <= MAX_RETRY_AFTER_MS
					? 3
					: 0,
			retryStrategy: 'exponential_backoff_jitter' as const,
			headersRetryAfterMs:
				error instanceof StackAIAPIError ? error.retryAfter : undefined,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StackAIAPIError && error.status >= 500,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof StackAIAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
