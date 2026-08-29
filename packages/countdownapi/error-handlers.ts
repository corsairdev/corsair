import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CountdownApiAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof CountdownApiAPIError &&
				(error.status === 429 || error.code === 429)
			) {
				return true;
			}
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			if (
				'cause' in error &&
				error.cause instanceof ApiError &&
				error.cause.status === 429
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error?: Error) => {
			let retryAfterMs: number | undefined;
			if (
				error instanceof CountdownApiAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			} else if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error &&
				'cause' in error &&
				error.cause instanceof ApiError &&
				error.cause.retryAfter !== undefined
			) {
				retryAfterMs = error.cause.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof CountdownApiAPIError &&
				(error.status === 401 || error.code === 401)
			) {
				return true;
			}
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			if (
				'cause' in error &&
				error.cause instanceof ApiError &&
				error.cause.status === 401
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async (error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (error?: Error) => true,
		handler: async (error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
