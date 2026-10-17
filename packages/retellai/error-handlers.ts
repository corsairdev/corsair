import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			error.message.toLowerCase().includes('rate limit'),
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 401) ||
			error.message.toLowerCase().includes('unauthorized'),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 404) ||
			error.message.toLowerCase().includes('not found'),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 400 || error.status === 422)) ||
			error.message.toLowerCase().includes('invalid'),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status >= 500) ||
			error.message.toLowerCase().includes('internal server'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
