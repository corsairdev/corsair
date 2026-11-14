import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// Single-owner rate limiting: corsair/http transport handles backoff and
	// retries (honouring Retry-After); the plugin error handler returns maxRetries: 0.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('429')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('unprocessable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
