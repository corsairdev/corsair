import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { TripadvisorAPIError } from './client';

/** Reads an HTTP status from a normalized or raw Tripadvisor error. */
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof TripadvisorAPIError) {
		return error.status;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				status === 429 ||
				error.message.toLowerCase().includes('too many requests')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof TripadvisorAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
