import type { CorsairErrorHandler } from 'corsair/core';
import type { TickTickAPIError } from './client';

function getCode(error: Error): string | undefined {
	return (error as Partial<TickTickAPIError>).code;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => getCode(error) === '429',
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: (error as Partial<TickTickAPIError>).retryAfter,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => getCode(error) === '401',
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
