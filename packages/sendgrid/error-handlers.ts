import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SendGridAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof SendGridAPIError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async (error) => {
			const retryAfterMs =
				(error instanceof ApiError ? error.retryAfter : undefined) ??
				(error instanceof SendGridAPIError ? error.retryAfter : undefined);
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterMs,
				retryStrategy: retryAfterMs
					? undefined
					: ('exponential_backoff' as const),
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (statusOf(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid api key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (statusOf(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('access forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (statusOf(error) === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = statusOf(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal server error') ||
				msg.includes('service unavailable')
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
