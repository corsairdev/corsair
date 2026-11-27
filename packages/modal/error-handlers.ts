import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Modal reports billing caps and spend limits as RESOURCE_EXHAUSTED too;
// retrying those only repeats the refusal.
const QUOTA_HINTS = /quota|limit|billing|credit|spend|plan/i;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// gRPC RESOURCE_EXHAUSTED, mapped to 429 in client.ts. Modal refused
		// the call before running it, so any operation may retry.
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: QUOTA_HINTS.test(error.message) ? 0 : 2,
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
	// The SDK already retries transient gRPC failures (UNAVAILABLE, INTERNAL,
	// DEADLINE_EXCEEDED) for each call, so nothing else is retried here.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
