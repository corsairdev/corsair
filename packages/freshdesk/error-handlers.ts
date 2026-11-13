import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FreshdeskAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			(error instanceof FreshdeskAPIError && error.status === 429),
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof FreshdeskAPIError ? error.retryAfter : undefined;
			return {
				// GETs are safe to retry; writes are not replayed because Freshdesk
				// documents no idempotency key for these operations.
				maxRetries:
					error instanceof FreshdeskAPIError && error.retryable ? 2 : 0,
				headersRetryAfterMs: retryAfter,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			(error instanceof FreshdeskAPIError &&
				(error.status === 401 || error.status === 403)),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 400 ||
					error.status === 404 ||
					error.status === 422)) ||
			(error instanceof FreshdeskAPIError &&
				[400, 404, 405, 409, 422].includes(error.status ?? 0)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status >= 500) ||
			(error instanceof FreshdeskAPIError && (error.status ?? 0) >= 500),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
