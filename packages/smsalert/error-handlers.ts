import type { CorsairErrorHandler } from 'corsair/core';
import { SmsalertError } from './client';

// The provider may have applied a write even when its response was lost.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => error instanceof SmsalertError && error.status === 429,
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof SmsalertError ? error.retryAfter : undefined,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
