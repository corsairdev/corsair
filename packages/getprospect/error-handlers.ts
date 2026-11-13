import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		// The transport extracts Retry-After; retry short request limits here, never daily job/quota refusals.
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return {
				maxRetries:
					retryAfterMs !== undefined &&
					retryAfterMs > 0 &&
					retryAfterMs <= 60_000
						? 2
						: 0,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
