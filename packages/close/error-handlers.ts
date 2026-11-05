import type { CorsairErrorHandler } from 'corsair/core';
import { CloseAPIError, CloseRateLimitError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof CloseRateLimitError) return true;
			if (error instanceof CloseAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('too many requests') ||
				msg.includes('rate_limit_exceeded') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof CloseRateLimitError ? error.retryAfterMs : undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof CloseAPIError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
