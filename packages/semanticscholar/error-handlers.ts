import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SemanticScholarAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof SemanticScholarAPIError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof SemanticScholarAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401 || statusOf(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('api key')
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
