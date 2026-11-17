import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			return error.message.toLowerCase().includes('invalid token');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
