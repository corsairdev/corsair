import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Core's request() has already retried a 429 three times, honouring
// Retry-After, before an error reaches these handlers, so none retries again.
// A 5xx or a timeout is not replayed either: most operations write, and a
// proxy or tool call may already have changed the end customer's account.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// A missing, revoked or under-scoped environment key.
	AUTH_ERROR: {
		match: (error: Error) => [401, 403].includes(statusOf(error) ?? 0),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
