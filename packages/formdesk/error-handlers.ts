import type { CorsairErrorHandler } from 'corsair/core';
import { FormdeskAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof FormdeskAPIError && error.status === 429,
		handler: async (error: Error) => {
			const apiError = error instanceof FormdeskAPIError ? error : undefined;
			return {
				maxRetries: apiError?.retryable ? 2 : 0,
				headersRetryAfterMs: apiError?.retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof FormdeskAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof FormdeskAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof FormdeskAPIError && error.code === 'TIMEOUT',
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof FormdeskAPIError && error.code === 'NETWORK_ERROR',
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
