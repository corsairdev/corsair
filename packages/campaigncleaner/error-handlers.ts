import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CampaignCleanerAPIError } from './client';

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof CampaignCleanerAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			(error instanceof CampaignCleanerAPIError && error.status === 429) ||
			error.message.toLowerCase().includes('429'),
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			(error instanceof CampaignCleanerAPIError &&
				(error.status === 401 || error.status === 403)) ||
			error.message.toLowerCase().includes('unauthorized'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
