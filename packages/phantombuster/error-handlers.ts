import type { CorsairErrorHandler } from 'corsair/core';
import type { PhantomBusterAPIError } from './client';

// Cast to Partial<PhantomBusterAPIError> because the error handler receives a
// base Error type from the Corsair framework; PhantomBusterAPIError fields are
// optional extras that may not be present on every Error subclass.
function getStatus(error: Error): number | undefined {
	return (error as Partial<PhantomBusterAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<PhantomBusterAPIError>).retryAfter;
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
