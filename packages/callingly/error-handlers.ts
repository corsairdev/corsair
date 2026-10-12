import type { CorsairErrorHandler } from 'corsair/core';
import { CallinglyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CallinglyAPIError ? error.status : undefined;
}

function isIdempotent(error: Error): boolean {
	const method = error instanceof CallinglyAPIError ? error.method : undefined;
	return method === 'GET' || method === 'PUT' || method === 'DELETE';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		// POST /calls dials a real phone, so only idempotent requests are replayed.
		handler: async (error: Error) => ({
			maxRetries: isIdempotent(error) ? 3 : 0,
			headersRetryAfterMs:
				error instanceof CallinglyAPIError ? error.retryAfterMs : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthenticated') || msg.includes('unauthorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: isIdempotent(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
