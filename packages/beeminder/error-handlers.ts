import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Beeminder failures are HTTP status plus `{"errors": ...}`.
 *
 * | status | meaning            |
 * | ------ | ------------------ |
 * | 400    | validation         |
 * | 401    | bad token          |
 * | 403    | forbidden          |
 * | 404    | missing resource   |
 * | 429    | rate limited       |
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
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('unauthenticated');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
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
