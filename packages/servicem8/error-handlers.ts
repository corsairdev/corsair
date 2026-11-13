import type { CorsairErrorHandler } from 'corsair/core';
import { ServiceM8Error } from './client';

// A timed-out write may already have taken effect; never replay it automatically.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => error instanceof ServiceM8Error && error.status === 429,
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ServiceM8Error ? error.retryAfter : undefined,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
