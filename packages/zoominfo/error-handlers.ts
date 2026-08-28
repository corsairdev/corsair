import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// ZoomInfo answers an expired or unknown JWT with 401 and the error code ZI0001.
const ZOOMINFO_AUTH_CODE = 'zi0001';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('429');
		},
		handler: async (error: Error) => {
			// The transport already retries 429 and honours Retry-After, so this
			// only forwards the server's delay rather than adding a second loop.
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes(ZOOMINFO_AUTH_CODE) ||
				msg.includes('unauthorized') ||
				msg.includes('authentication failed') ||
				msg.includes('invalid bearer token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
