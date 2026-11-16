import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 429) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('429') ||
				message.includes('rate limit') ||
				message.includes('too many requests')
			);
		},
		// corsair/http already retried safe reads (three attempts, honouring
		// Retry-After). Writes are sent with retries disabled so they are never
		// replayed; retrying here would repeat that mistake.
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('forbidden') ||
				message.includes('api token is required') ||
				message.includes('invalid token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
