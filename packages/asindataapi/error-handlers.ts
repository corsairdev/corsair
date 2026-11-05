import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { AsinDataApiAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with AsinDataApiAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<AsinDataApiAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AsinDataApiAPIError>).retryAfter;
}

/**
 * Error handlers for the ASIN Data API plugin.
 *
 * The API returns `request_info.success=false` in the response body for
 * logical errors, and standard HTTP status codes for transport/auth issues:
 * - 401: invalid API key
 * - 400: malformed request parameters
 * - 404: resource not found
 * - 429: rate limit exceeded (API is credit/rate limited)
 * - 5xx: internal server error
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limit')
			);
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 5,
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
		handler: async () => {
			console.log('[ASINDATAAPI] Authentication failed — check your API key.');
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
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
			console.error(`[ASINDATAAPI] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;

export { ApiError };
