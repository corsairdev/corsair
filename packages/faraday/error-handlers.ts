import type { CorsairErrorHandler } from 'corsair/core';
import { FaradayAPIError, FaradayRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof FaradayRateLimitError) return true;
			if (error instanceof FaradayAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof FaradayRateLimitError ? error.retryAfterMs : undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof FaradayAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_authorization') ||
				msg.includes('malformed_api_key') ||
				msg.includes('missing_api_key') ||
				msg.includes('expired_api_key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
