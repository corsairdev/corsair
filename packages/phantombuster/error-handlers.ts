import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PhantomBusterAPIError } from './client';

// instanceof narrowing is the repo-required idiom here: the handler receives
// a base Error, and status/retryAfter only exist on ApiError (transport) or
// PhantomBusterAPIError (client wrapper that copies those fields).
function getStatus(error: Error): number | undefined {
	if (error instanceof PhantomBusterAPIError) return error.status;
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof PhantomBusterAPIError) return error.retryAfter;
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('rate_limited') || message.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			if (getStatus(error) === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('forbidden') ||
				message.includes('invalid_key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
