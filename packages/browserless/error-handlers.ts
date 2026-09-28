import type { CorsairErrorHandler } from 'corsair/core';
import { BrowserlessAPIError, BrowserlessRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BrowserlessRateLimitError) return true;
			return error instanceof BrowserlessAPIError && error.status === 429;
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof BrowserlessRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BrowserlessAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid token') ||
				msg.includes('api token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
