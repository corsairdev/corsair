import type { CorsairErrorHandler } from 'corsair/core';
import { WebflowAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof WebflowAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof WebflowAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof WebflowAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
