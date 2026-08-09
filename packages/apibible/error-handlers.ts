import type { CorsairErrorHandler } from 'corsair/core';
import type { ApiBibleAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with ApiBibleAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<ApiBibleAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<ApiBibleAPIError>).retryAfter;
}

/**
 * Error handlers for the API.Bible plugin.
 *
 * API.Bible error codes:
 * - 400: Bad request (invalid query or resource ID)
 * - 401: Invalid or missing API key (`api-key` header)
 * - 403: Access denied for the requested Bible version
 * - 404: Resource not found
 * - 429: Rate limit exceeded (requests per minute, based on plan). A
 *   `Retry-After` header indicates seconds to wait.
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
			console.warn(
				'[APIBIBLE] Authentication failed — check your `api-key`. ' +
					`Error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async (error: Error) => {
			console.warn(
				'[APIBIBLE] Resource not found — the requested Bible ID, book, or ' +
					`reference may not exist. Error: ${error.message}`,
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
			console.error(`[APIBIBLE] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
