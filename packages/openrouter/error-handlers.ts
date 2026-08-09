import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Error handlers for the OpenRouter plugin.
 *
 * OpenRouter error codes: https://openrouter.ai/docs/errors
 * - 401: Authentication fails (invalid API key)
 * - 402: Quota exceeded / insufficient credits
 * - 403: Access denied (e.g. model restricted for this key)
 * - 408: Request timeout
 * - 422: Invalid request body / parameters
 * - 429: Rate limit reached
 * - 5xx: Server errors; includes 529, which OpenRouter uses for overloaded
 *        servers. Models without max completion tokens may also 5xx.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limit') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_api_key');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('insufficient') || msg.includes('quota');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	INVALID_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 422) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('invalid') || msg.includes('validation');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) {
				return (
					(error.status >= 500 && error.status < 600) || error.status === 529
				);
			}
			const msg = error.message.toLowerCase();
			return msg.includes('server error') || msg.includes('overloaded');
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
