import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			return error instanceof ApiError && error.status === 429;
		},
		handler: async (error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid_token') ||
				message.includes('invalid auth')
			);
		},
		handler: async () => ({
			maxRetries: 0,
		}),
	},
	PERMISSION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 403,
		handler: async () => ({
			maxRetries: 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({
			maxRetries: 0,
		}),
	},
} satisfies CorsairErrorHandler;
