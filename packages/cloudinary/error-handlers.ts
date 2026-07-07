import { ApiError } from 'corsair/http';
import type { CorsairErrorHandler } from 'corsair/core';
import { CloudinaryAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof ApiError && error.status === 420) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('420');
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
			if (error instanceof CloudinaryAPIError && error.code === '401') return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('authorization required');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not allowed') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('resource not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return msg.includes('network') || msg.includes('fetch failed');
		},
		handler: async () => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
