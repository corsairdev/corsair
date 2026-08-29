import type { CorsairErrorHandler } from 'corsair/core';
import type { StormglassAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<StormglassAPIError>).status;
}

/**
 * Stormglass error codes:
 * - 401/403: missing or invalid API key
 * - 402: daily request quota exceeded
 * - 422: invalid/missing request parameters
 * - 429: rate limited
 * - 5xx: upstream server error
 */
export const errorHandlers = {
	/**
	 * The shared transport already retries 429s with backoff (the default
	 * rate-limit config: 4 attempts total), so this must not retry again at
	 * the operation level — the two layers would multiply into up to 16
	 * requests per call.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('rate limit') || message.includes('429');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('api key is invalid') ||
				message.includes('unauthorized') ||
				message.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (getStatus(error) === 402) return true;
			return error.message.toLowerCase().includes('quota');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error) => {
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
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
