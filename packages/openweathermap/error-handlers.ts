import type { CorsairErrorHandler } from 'corsair/core';
import type { OpenWeatherMapAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with OpenWeatherMapAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<OpenWeatherMapAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<OpenWeatherMapAPIError>).retryAfter;
}

/**
 * Error handlers for the OpenWeatherMap plugin.
 *
 * OpenWeatherMap error codes:
 * - 401: Invalid API key or API key not activated (new keys take up to 2 hours)
 * - 404: Data not available for the requested location/time
 * - 429: Rate limit exceeded (free tier: 60 calls/min, 1,000 calls/day)
 * - 5xx: Internal server error
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: getRetryAfter(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid api key') ||
				msg.includes('unauthorized') ||
				msg.includes('401')
			);
		},
		handler: async (error: Error) => {
			console.log(
				'[OPENWEATHERMAP] Authentication failed — check your API key. ' +
					'Note: new API keys can take up to 2 hours to activate.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async (error: Error) => {
			console.warn(
				'[OPENWEATHERMAP] Data not found — the requested location or time range may not have data available.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[OPENWEATHERMAP] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
