import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 429
				: /rate limit|too many requests|\b429\b/i.test(error.message),
		// Core transport owns transient 429 retries and honors Retry-After.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 401 || error.status === 403
				: /unauthorized|forbidden|invalid api key/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 400 || error.status === 422
				: /bad request|invalid request/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
