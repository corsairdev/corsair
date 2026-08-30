import type { CorsairErrorHandler } from 'corsair/core';
import type { RemovebgAPIError } from './client';

// makeRemovebgRequest wraps every transport failure into RemovebgAPIError, so
// matching on `instanceof ApiError` here would never fire; read the status
// and retryAfter it republishes instead.
function getStatus(error: Error): number | undefined {
	return (error as Partial<RemovebgAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<RemovebgAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			// remove.bg returns 403 (not 401) for a missing/invalid API key.
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => getStatus(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
