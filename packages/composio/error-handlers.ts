import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			// Prefer structured status — avoid substring "429" false positives.
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				/\brate[_ ]?limit(?:ed)?\b/.test(msg) ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				// Respect an explicit Retry-After delay from the API.
				return { maxRetries: 5, headersRetryAfterMs: error.retryAfter };
			}
			// No Retry-After header: back off exponentially instead of firing
			// retries back-to-back against a throttled endpoint.
			return { maxRetries: 5, retryStrategy: 'exponential_backoff' };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_api_key') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
