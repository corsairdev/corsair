import type { CorsairErrorHandler } from 'corsair/core';
import { CoinbaseAPIError, CoinbaseRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof CoinbaseRateLimitError) return true;
			if (error instanceof CoinbaseAPIError && error.status === 429) {
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
				error instanceof CoinbaseRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof CoinbaseAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_token') ||
				msg.includes('expired_token') ||
				msg.includes('authentication') ||
				msg.includes('401')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof CoinbaseAPIError && error.status === 403) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('insufficient_scope') ||
				msg.includes('permission') ||
				msg.includes('403')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof CoinbaseAPIError && error.status === 404) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not_found') ||
				msg.includes('not found') ||
				msg.includes('404')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof CoinbaseAPIError && error.status === 400) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid_request') ||
				msg.includes('validation') ||
				msg.includes('400')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
