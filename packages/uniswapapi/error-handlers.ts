import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { UniswapApiAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof UniswapApiAPIError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof UniswapApiAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			if (error instanceof UniswapApiAPIError) {
				const code = error.code?.toLowerCase();
				if (code === 'too_many_requests' || code === 'rate_limited') {
					return true;
				}
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
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
