import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { EmeliaAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof EmeliaAPIError && error.status === 429) return true;
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
				error instanceof EmeliaAPIError &&
				typeof error.retryAfter === 'number'
			) {
				retryAfterMs = error.retryAfter * 1000;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof EmeliaAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_auth')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			if (error instanceof EmeliaAPIError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('access denied');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (error instanceof EmeliaAPIError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
