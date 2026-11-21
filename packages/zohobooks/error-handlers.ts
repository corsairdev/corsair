import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { getZohoBooksApiErrorCode } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Daily plan quota exhaustion (code 45) cannot recover by retrying.
		handler: async (error) => {
			const code = getZohoBooksApiErrorCode(error);
			if (code === 45 || code === '45') return { maxRetries: 0 };
			const retryAfter =
				error instanceof ApiError ? error.retryAfter : undefined;
			return {
				maxRetries: 1,
				...(retryAfter !== undefined
					? { headersRetryAfterMs: retryAfter }
					: {}),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
