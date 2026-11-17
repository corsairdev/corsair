import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limit') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		handler: async (error?: Error) => {
			let headersRetryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				headersRetryAfterMs = error.retryAfter;
			}
			// Single-owner rate limiting: return maxRetries: 0 so corsair/http transport owns retries
			return { maxRetries: 0, headersRetryAfterMs };
		},
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
				msg.includes('invalid api key') ||
				msg.includes('invalid_auth') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	UNPROCESSABLE_ENTITY_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 422) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unprocessable') ||
				msg.includes('validation error') ||
				msg.includes('422')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('400');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status !== undefined &&
				error.status >= 500
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('server error') || msg.includes('500');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error?: Error) => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
