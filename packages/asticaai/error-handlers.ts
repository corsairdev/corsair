import type { CorsairErrorHandler } from 'corsair/core';
import type { AsticaAiAPIError } from './client';

// The client wraps every transport failure, so matching on `instanceof ApiError`
// here would never fire; the wrapper republishes status and retryAfter instead.
function getStatus(error: Error): number | undefined {
	return (error as Partial<AsticaAiAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AsticaAiAPIError>).retryAfter;
}

// maxRetries is 0 throughout: bind.ts discards the retried call's result and
// rethrows the original error, so retries only add delay before the same
// failure surfaces. Callers retry using the metadata preserved on the error.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			// Astica reports a bad key as HTTP 200 with status:'error', so the only
			// signal is the message. Both hosts answer a bad key with exactly
			// "invalid api token"; the rest are defensive.
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid api token') ||
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key') ||
				msg.includes('authentication')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
