import type { CorsairErrorHandler } from 'corsair/core';
import { ParallelError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ParallelError && error.status === 429,
		// parallelRequest calls fetch directly, so core's request() never sees
		// this 429. A 429 means Parallel refused the call before running it, so
		// retrying is safe for every operation, including billable ones.
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs:
				error instanceof ParallelError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ParallelError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
