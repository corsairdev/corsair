import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FinmeiAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof FinmeiAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		// Rate-limit retries: single owner pattern (transport owns: error handlers return { maxRetries: 0 })
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError || error instanceof FinmeiAPIError) &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('unauthenticated') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_token') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError || error instanceof FinmeiAPIError) &&
				error.status === 404
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError || error instanceof FinmeiAPIError) &&
				(error.status === 400 || error.status === 422)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('validation') ||
				msg.includes('400') ||
				msg.includes('422')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
