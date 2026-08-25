import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BeeminderHttpError } from './client';

/**
 * Beeminder error handling.
 *
 * Beeminder reports failures with HTTP status codes and an error message.
 * Common patterns:
 *
 * | status | meaning                         |
 * | ------ | ------------------------------- |
 * | 400    | Bad request / validation error  |
 * | 401    | Authentication failure          |
 * | 403    | Forbidden                       |
 * | 404    | Not found                       |
 * | 422    | Unprocessable entity            |
 * | 429    | Rate limited                    |
 * | 500    | Server error                    |
 */
export const errorHandlers = {
	/**
	 * Rate limiting. Beeminder answers 429 with a Retry-After header.
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof BeeminderHttpError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			if (
				error instanceof BeeminderHttpError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},

	/**
	 * Authentication failures. Never retried - the same token will fail again.
	 */
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof BeeminderHttpError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('authentication');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * Forbidden. The token is valid but lacks permission for this operation.
	 */
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			if (error instanceof BeeminderHttpError && error.status === 403) {
				return true;
			}
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * Resource not found.
	 */
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (error instanceof BeeminderHttpError && error.status === 404) {
				return true;
			}
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
