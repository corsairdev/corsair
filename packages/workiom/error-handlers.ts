import type { CorsairErrorHandler } from 'corsair/core';
import { WorkiomAPIError, WorkiomRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof WorkiomRateLimitError) return true;
			if (error instanceof WorkiomAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof WorkiomRateLimitError ? error.retryAfterMs : undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof WorkiomAPIError) {
				if (error.status === 401 || error.status === 403) return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('unauthenticated') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
