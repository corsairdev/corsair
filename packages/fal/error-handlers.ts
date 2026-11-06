import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// fal answers 429 when an account is over its concurrency limit, or when a
	// queue already holds fal_max_queue_length requests. Nothing ran, so a
	// retry is safe.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	// 401: missing or wrong key. 403: the key's scope lacks the permission
	// (account.billing needs billing read access).
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
