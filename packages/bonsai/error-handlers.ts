import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BonsaiAPIError } from './client';

/**
 * The client wraps transport `ApiError`s in `BonsaiAPIError` (keeping the
 * original as `cause`), so status-based matching must recognize both shapes.
 * The `instanceof ApiError` branch covers errors inspected before wrapping;
 * the `BonsaiAPIError` branch covers everything an endpoint actually throws.
 */
function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof BonsaiAPIError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof BonsaiAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('too many requests') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			return { maxRetries: 5, headersRetryAfterMs: getRetryAfter(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
