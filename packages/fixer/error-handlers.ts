import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FixerAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof FixerAPIError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			if (
				error instanceof FixerAPIError &&
				(error.code === 104 || error.code === '104')
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401 || statusOf(error) === 403) return true;
			if (
				error instanceof FixerAPIError &&
				(error.code === 101 ||
					error.code === '101' ||
					error.code === 102 ||
					error.code === '102')
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid access key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
