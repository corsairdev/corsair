import type { CorsairErrorHandler } from 'corsair/core';
import { ForceManagerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ForceManagerAPIError && error.status === 429,
		handler: async (error: Error) => ({
			// A 429 means ForceManager did not process the request, so retrying a write is safe; core waits for
			// Retry-After when the response carries one.
			maxRetries: 3,
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
