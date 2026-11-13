import type { CorsairErrorHandler } from 'corsair/core';
import { PostalyticsAPIError, PostalyticsRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof PostalyticsRateLimitError,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof PostalyticsRateLimitError
					? error.retryAfterMs
					: undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PostalyticsAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
