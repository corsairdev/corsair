import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { TurbotPipesAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof TurbotPipesAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429') || msg.includes('too many requests');
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
			if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return true;
			if (error instanceof TurbotPipesAPIError && (error.status === 401 || error.status === 403)) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth') || msg.includes('forbidden') || msg.includes('401') || msg.includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (error instanceof TurbotPipesAPIError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			if (error instanceof TurbotPipesAPIError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('invalid') || msg.includes('400');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status && error.status >= 500) return true;
			if (error instanceof TurbotPipesAPIError && error.status && error.status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('internal server error') || msg.includes('500') || msg.includes('502') || msg.includes('503');
		},
		handler: async () => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
