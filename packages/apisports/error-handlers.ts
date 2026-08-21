import type { CorsairErrorHandler } from 'corsair/core';
import type { ApiSportsAPIError } from './client';

// CorsairErrorHandler receives a plain Error; duck-type ApiSports-specific fields
// without instanceof so handlers work across module boundaries.
function getStatus(error: Error): number | undefined {
	return (error as Partial<ApiSportsAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<ApiSportsAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401 || getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid key') ||
				msg.includes('application key') ||
				msg.includes('token:') ||
				msg.includes('401')
			);
		},
		handler: async () => {
			console.error(
				'[API_SPORTS] Authentication failed — check your x-apisports-key.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[API_SPORTS] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
