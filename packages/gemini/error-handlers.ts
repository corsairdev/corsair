import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Error handlers for the Gemini plugin.
 *
 * client.ts rethrows ApiError instances as-is (unwrapped), so status codes
 * and Retry-After values are read directly off `error` here.
 *
 * Gemini API error codes:
 * - 400: Invalid argument / failed precondition (e.g. quota exceeded on paid tier)
 * - 401/403: Invalid or missing API key, or permission denied
 * - 404: Model or operation not found
 * - 429: Rate limit / quota exceeded
 * - 500/503: Internal error or model overloaded
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('resource_exhausted') ||
				msg.includes('quota')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('api key not valid') ||
				msg.includes('permission_denied') ||
				msg.includes('unauthenticated')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not_found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unavailable') || msg.includes('internal error');
		},
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
