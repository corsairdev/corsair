import type { CorsairErrorHandler } from 'corsair/core';
import { BrowserUseAPIError, BrowserUseRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BrowserUseRateLimitError) return true;
			return error instanceof BrowserUseAPIError && error.status === 429;
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof BrowserUseRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof BrowserUseAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
