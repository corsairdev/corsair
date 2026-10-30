import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('not allowed');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status !== undefined) {
				return error.status >= 500;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal server error') ||
				msg.includes('service unavailable')
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
