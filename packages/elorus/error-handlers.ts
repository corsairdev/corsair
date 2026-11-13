import type { CorsairErrorHandler } from 'corsair/core';
import { ElorusAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ElorusAPIError
				? error.status === 429
				: error.message.includes('429') ||
					error.message.toLowerCase().includes('rate limit'),
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ElorusAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ElorusAPIError
				? error.status === 401 || error.status === 403
				: error.message.toLowerCase().includes('unauthorized') ||
					error.message.toLowerCase().includes('forbidden'),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ElorusAPIError
				? error.status === 400 || error.status === 422
				: error.message.toLowerCase().includes('bad request'),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof ElorusAPIError
				? error.status === 404
				: error.message.toLowerCase().includes('not found'),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ElorusAPIError ? (error.status ?? 0) >= 500 : false,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
