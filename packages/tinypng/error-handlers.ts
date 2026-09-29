import type { CorsairErrorHandler } from 'corsair/core';

import { TinypngAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TinypngAPIError && error.statusCode === 429,

		handler: async () => ({
			maxRetries: 5,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TinypngAPIError && error.statusCode === 401,

		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
