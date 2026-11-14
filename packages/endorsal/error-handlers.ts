import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => ({
			// GETs are safe to retry; writes are not replayed after an ambiguous 429.
			maxRetries:
				error instanceof ApiError && error.request.method === 'GET' ? 3 : 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof ApiError && error.request.method === 'GET' ? 2 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
