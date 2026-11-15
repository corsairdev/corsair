import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ForceManagerAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof ForceManagerAPIError)
		return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			// A 429 means ForceManager did not process the request, so retrying a write is safe; core waits for
			// Retry-After when the response carries one.
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError || error instanceof ForceManagerAPIError
					? error.retryAfter
					: undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
