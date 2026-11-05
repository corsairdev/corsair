import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

const PAID_WRITE_OPERATIONS = new Set([
	'chatCompletions.create',
	'messages.create',
	'embeddings.create',
]);

function retryTransientRead(context: { operation: string }) {
	if (PAID_WRITE_OPERATIONS.has(context.operation)) {
		return { maxRetries: 0 };
	}
	return {
		maxRetries: 3,
		retryStrategy: 'exponential_backoff' as const,
	};
}

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
			return msg.includes('rate_limit') || /(?:^|\s)429(?:\s|$)/.test(msg);
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
			return (
				msg.includes('invalid request') || msg.includes('validation error')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 408) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('request timeout') || msg.includes('timed out');
		},
		handler: async (_error, context) => retryTransientRead(context),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) {
				return error.status >= 500 && error.status < 600;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('server error') || msg.includes('overloaded');
		},
		handler: async (_error, context) => retryTransientRead(context),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
