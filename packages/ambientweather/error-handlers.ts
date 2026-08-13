import type { CorsairErrorHandler } from 'corsair/core';
import type { AmbientWeatherAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (
		(error as Partial<AmbientWeatherAPIError>).code ??
		(error as Partial<AmbientWeatherAPIError>).status
	);
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AmbientWeatherAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('rate limit') || message.includes('429');
		},
		handler: async (error) => ({
			maxRetries: 0,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('forbidden') ||
				message.includes('authentication') ||
				message.includes('apikey') ||
				message.includes('applicationkey')
			);
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
