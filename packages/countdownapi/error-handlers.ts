import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	/**
	 * `maxRetries: 0` is deliberate: the shared request layer already
	 * retries 429s in a real loop, so reaching this handler means those
	 * retries failed - stacking a second retry here would only spend extra
	 * requests against a metered credit balance for no benefit (same
	 * rationale as `packages/serpapi/error-handlers.ts`).
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error?: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async (error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (error?: Error) => true,
		handler: async (error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
