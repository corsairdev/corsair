import type { CorsairErrorHandler } from 'corsair/core';
import { BlocknativeAPIError, BlocknativeRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BlocknativeRateLimitError) return true;
			if (error instanceof BlocknativeAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('ratelimit') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof BlocknativeRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BlocknativeAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('authorization header must contain a valid apikey') ||
				msg.includes('not a valid api key') ||
				msg.includes('unauthorized') ||
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
