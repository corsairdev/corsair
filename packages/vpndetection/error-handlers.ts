import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	return undefined;
}

/**
 * The API answers without a key, so a 401 or 403 only comes from a key that
 * was set and rejected. A bad address is a 400 with `{"error": "..."}`.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
