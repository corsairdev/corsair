import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { StormglassAPIError, StormglassRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof StormglassRateLimitError) return true;
			if (error instanceof StormglassAPIError && error.status === 429) {
				return true;
			}
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof StormglassRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof StormglassAPIError) {
				if (error.status === 401 || error.status === 403) return true;
			}
			if (error instanceof ApiError) {
				if (error.status === 401 || error.status === 403) return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('key is missing') ||
				msg.includes('key is invalid')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
