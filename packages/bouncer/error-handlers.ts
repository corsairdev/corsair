import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BouncerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof BouncerAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof BouncerAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			if (
				error instanceof BouncerAPIError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid_auth') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error?: Error) => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
