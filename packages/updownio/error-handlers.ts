import type { CorsairErrorHandler } from 'corsair/core';
import { UpdownIOAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof UpdownIOAPIError ? error.status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		// Every operation is an idempotent GET, so replaying after a 429 is safe.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof UpdownIOAPIError ? error.retryAfterMs : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('api key is required')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
