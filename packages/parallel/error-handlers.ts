import type { CorsairErrorHandler } from 'corsair/core';
import { ParallelError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ParallelError && error.status === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ParallelError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
