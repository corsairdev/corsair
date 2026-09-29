import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FlexisignAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof FlexisignAPIError) {
		return error.status;
	}
	return undefined;
}

function getRetryAfterMs(error: Error): number | undefined {
	if (
		(error instanceof ApiError || error instanceof FlexisignAPIError) &&
		typeof error.retryAfter === 'number'
	) {
		return error.retryAfter;
	}
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
			return {
				maxRetries: 5,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: getRetryAfterMs(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
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
