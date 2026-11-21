import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return false;
		},
		// Ping is a safe read. The HTTP transport extracts Retry-After without
		// retrying; this handler owns at most one endpoint-level retry.
		handler: async (error: Error) => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			return (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
