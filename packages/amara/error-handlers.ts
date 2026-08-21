import type { CorsairErrorHandler } from 'corsair/core';
import type { AmaraAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<AmaraAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AmaraAPIError>).retryAfter;
}

/**
 * Error handlers for the Amara plugin.
 *
 * - 401/403: missing or invalid API key / insufficient permissions
 * - 404: resource not found
 * - 400/422: malformed request
 * - 429: rate limited
 * - 5xx: upstream failure
 *
 * When an HTTP status is present, message heuristics must not override it.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
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
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('401') ||
				msg.includes('403') ||
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => {
			console.error(
				'[AMARA] Authentication failed — check that the API key is valid.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 404;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async () => {
			console.warn('[AMARA] Resource not found.');
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 400 || status === 422;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('400') ||
				msg.includes('422') ||
				msg.includes('unprocessable')
			);
		},
		handler: async () => {
			console.warn(
				'[AMARA] Request rejected — a required parameter is missing or malformed.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status >= 500;
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
			console.error(`[AMARA] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
