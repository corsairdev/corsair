import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
			);
		},
		handler: async (error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return errorMessage.includes('not found');
		},
		handler: async (error, context) => {
			console.warn(`[REDDIT:${context.operation}] Not found: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('private') ||
				errorMessage.includes('quarantined')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[REDDIT:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[REDDIT:${context.operation}] Authentication failed: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (error, context) => {
			console.error(
				`[REDDIT:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
