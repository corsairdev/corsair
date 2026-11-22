import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleDriveAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof GoogleDriveAPIError) return error.code;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// The shared HTTP client already retries a 429 and returns the attempt
		// that succeeds; retrying here again would throw that success away.
		handler: async () => ({ maxRetries: 0 }),
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
