import type { CorsairErrorHandler } from 'corsair/core';
import { ForceManagerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ForceManagerAPIError && error.status === 429,
		handler: async (error: Error) => ({
			// The official v4 contract publishes no retry policy; surface Retry-After without retrying writes.
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ForceManagerAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ForceManagerAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ForceManagerAPIError && error.status === 400,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
