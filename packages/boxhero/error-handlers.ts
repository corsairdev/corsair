import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * BoxHero returns a JSON error envelope (`type`, `title`, `correlationID`).
 *
 * | status | meaning                          |
 * | ------ | -------------------------------- |
 * | 400    | validation / not LOCATION mode   |
 * | 401    | missing or invalid API token     |
 * | 403    | forbidden                        |
 * | 404    | missing resource                 |
 * | 429    | team rate limit                  |
 *
 * @see https://rest.boxhero-app.com/docs/api
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('too-many-requests');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
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
			return error.message.toLowerCase().includes('not-found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			return error.message.toLowerCase().includes('invalid-request');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
