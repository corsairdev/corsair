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
				errorMessage.includes('rate_limited') || errorMessage.includes('429')
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
	AUTH_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			// Merriam-Webster returns HTTP 200 with a plain-text "Invalid API key"
			// body instead of a 401 — client.ts surfaces that as a thrown Error.
			return error.message.toLowerCase().includes('invalid api key');
		},
		handler: async (error, context) => {
			console.warn(`[DICTIONARY:${context.operation}] Authentication failed`);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (error, context) => {
			console.error(
				`[DICTIONARY:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
