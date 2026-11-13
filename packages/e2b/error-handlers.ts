import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Only the HTTP status decides: a message can contain '429' inside an ID.
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => ({
			// A 429 means E2B rejected the operation; preserve its Retry-After delay.
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			error.message.toLowerCase().includes('unauthorized'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
