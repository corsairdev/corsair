import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GorgiasAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			(error instanceof GorgiasAPIError && error.status === 429),
		// The shared transport retries ApiError 429s and the binary transport
		// owns its Retry-After loop, so another endpoint retry would multiply calls.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			(error instanceof GorgiasAPIError &&
				(error.status === 401 || error.status === 403)),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
