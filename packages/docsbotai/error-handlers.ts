import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Core's request() already retries a 429 three times (see client.ts), so the
// handlers add no retries of their own. A 5xx or network error is not
// replayed: a write or a credit-spending call may already have landed.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
