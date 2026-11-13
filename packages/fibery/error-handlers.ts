import type { CorsairErrorHandler } from 'corsair/core';
import { FiberyAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof FiberyAPIError && error.status === 429,
		handler: async (error: Error) => ({
			// Mutations are not retried automatically: a timed-out Fibery write may have succeeded.
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof FiberyAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof FiberyAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof FiberyAPIError &&
			(error.status === 400 || error.status === 404 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
