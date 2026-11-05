import type { CorsairErrorHandler } from 'corsair/core';

import { AblyAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof AblyAPIError && error.statusCode === 429,

		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof AblyAPIError ? error.retryAfter : undefined;

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},

	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof AblyAPIError && error.statusCode === 401,

		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
