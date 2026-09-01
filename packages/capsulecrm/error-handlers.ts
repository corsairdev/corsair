import type { CorsairErrorHandler } from 'corsair/core';
import { CapsuleCrmAPIError, CapsuleCrmRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof CapsuleCrmRateLimitError) return true;
			if (error instanceof CapsuleCrmAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit reached') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof CapsuleCrmRateLimitError
					? error.retryAfterMs
					: error instanceof CapsuleCrmAPIError
						? error.retryAfter
						: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof CapsuleCrmAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('requires authentication') ||
				msg.includes('invalid_token') ||
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
