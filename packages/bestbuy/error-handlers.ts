import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BestBuyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof BestBuyAPIError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof BestBuyAPIError) return error.retryAfter;
	return undefined;
}

/**
 * Best Buy Remix HTTP errors. Rate limit is 5 calls/sec, 50,000/day.
 * https://developer.bestbuy.com/legal
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401 || statusOf(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
