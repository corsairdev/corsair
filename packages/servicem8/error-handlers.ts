import type { CorsairErrorHandler } from 'corsair/core';
import { ServiceM8Error } from './client';

// The client makes its own fetch, so core's request() retries don't apply:
// a per-minute 429 is retried here (ServiceM8 refused the request before
// running it, so writes are safe to repeat). The daily limit is not retried.
// A timed-out write may already have taken effect; never replay it automatically.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => error instanceof ServiceM8Error && error.status === 429,
		handler: async (error) => ({
			maxRetries: error instanceof ServiceM8Error && error.dailyLimit ? 0 : 3,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs:
				error instanceof ServiceM8Error ? error.retryAfter : undefined,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
