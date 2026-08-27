import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Vestaboard Error handling.
 *
 * | Status | Meaning |
 * | ------ | ------- |
 * | 400    | Bad Request / Invalid format |
 * | 401    | Unauthorized / Invalid API Key or Secret |
 * | 403    | Forbidden / Subscription access denied |
 * | 404    | Resource or board not found |
 * | 429    | Rate limit exceeded |
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('unauthenticated') || msg.includes('invalid key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden') || error.message.toLowerCase().includes('permission denied');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
