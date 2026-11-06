import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Google API errors for Veo predictLongRunning / fetchPredictOperation.
 * Generation is not idempotent, so 5xx is not retried: the operation may
 * already have been accepted. HTTP 429 (and the documented quota wording)
 * is the retryable case. Handlers are first-match, so DEFAULT stays last.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('resource exhausted') ||
				msg.includes('quota exceeded') ||
				msg.includes('rate limit')
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
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthenticated') ||
				msg.includes('permission denied') ||
				msg.includes('permission_denied')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 404)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid argument') ||
				msg.includes('invalid_argument') ||
				msg.includes('not found') ||
				msg.includes('not_found')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
