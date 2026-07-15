import type { CorsairErrorHandler } from 'corsair/core';
import { PerplexityAiAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof PerplexityAiAPIError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (
				error instanceof PerplexityAiAPIError &&
				error.retryAfter !== undefined &&
				error.retryAfter !== null
			) {
				const retryAfterVal = Number(error.retryAfter);
				if (!isNaN(retryAfterVal)) {
					retryAfterMs = retryAfterVal;
				}
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof PerplexityAiAPIError && error.status === 401)
				return true;
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
