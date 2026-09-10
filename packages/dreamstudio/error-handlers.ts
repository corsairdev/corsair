import type { CorsairErrorHandler } from 'corsair/core';
import { DreamstudioAPIError, DreamstudioRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof DreamstudioRateLimitError) return true;
			if (error instanceof DreamstudioAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof DreamstudioRateLimitError
					? error.retryAfterMs
					: undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof DreamstudioAPIError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('missing authorization')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
