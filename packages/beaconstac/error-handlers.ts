import type { CorsairErrorHandler } from 'corsair/core';
import { BeaconstacAPIError, BeaconstacRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BeaconstacRateLimitError) return true;
			if (error instanceof BeaconstacAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof BeaconstacRateLimitError
					? error.retryAfterMs
					: error instanceof BeaconstacAPIError
						? error.retryAfter
						: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BeaconstacAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('401')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
