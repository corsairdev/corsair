import type { CorsairErrorHandler } from 'corsair/core';
import { VestaboardAPIError, VestaboardRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof VestaboardRateLimitError) return true;
			if (error instanceof VestaboardAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof VestaboardRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof VestaboardAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('unauthenticated') ||
				msg.includes('invalid key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
