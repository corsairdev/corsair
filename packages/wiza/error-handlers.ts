import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return /\brate[_\s-]?limit(?:ed)?\b/i.test(error.message);
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
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status >= 500) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('econnreset') ||
				msg.includes('etimedout') ||
				msg.includes('enotfound') ||
				msg.includes('network')
			);
		},
		handler: async (_error, context) => {
			// Credit-consuming POST — ambiguous network failures must not retry
			// or Wiza may charge twice for one reveal.
			if (context.operation === 'individualReveals.start') {
				return { maxRetries: 0 };
			}
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
