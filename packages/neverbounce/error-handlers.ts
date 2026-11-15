import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NeverBounceAPIError } from './client';

export const errorHandlers = {
	// An HTTP 429 was already retried by core's request(), so it is not
	// retried again here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// NeverBounce throttles with HTTP 200 and `status: throttle_triggered`,
	// which core never sees as a 429. The request was refused before any
	// verification ran, so retrying it spends nothing twice.
	THROTTLE_ERROR: {
		match: (error: Error) =>
			error instanceof NeverBounceAPIError &&
			error.status === 'throttle_triggered',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			(error instanceof NeverBounceAPIError && error.status === 'auth_failure'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
