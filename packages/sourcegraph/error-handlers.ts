import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SourcegraphAPIError, SourcegraphRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof SourcegraphRateLimitError) return true;
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof SourcegraphAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof SourcegraphRateLimitError
					? error.retryAfterMs
					: error instanceof ApiError
						? error.retryAfter
						: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof SourcegraphAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid access token')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
