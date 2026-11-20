import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Never replay mutations: a failed response does not establish whether Fly applied one.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 429,
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
