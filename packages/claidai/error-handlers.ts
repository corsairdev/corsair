import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 429;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || /\b429\b/.test(msg);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) {
				return error.status === 401 || error.status === 403;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('authorization is required') ||
				msg.includes('not enough permissions')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 404;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not found') ||
				msg.includes('storage not found') ||
				/\b404\b/.test(msg)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
