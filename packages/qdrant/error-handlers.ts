import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

const hasStatus = (error: Error, status: number) =>
	error instanceof ApiError && error.status === status;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => hasStatus(error, 429),
		// corsair/http has already retried 429s, honouring Retry-After.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => hasStatus(error, 401),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
