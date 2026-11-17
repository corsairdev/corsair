import type { CorsairErrorHandler } from 'corsair/core';
import type { ETerminAPIError } from './client';

function status(error: Error): number | undefined {
	return (error as ETerminAPIError).status;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => status(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs: (error as ETerminAPIError).retryAfter,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => [401, 403].includes(status(error) ?? 0),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => [400, 422].includes(status(error) ?? 0),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => (status(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
