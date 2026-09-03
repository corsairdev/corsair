import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			error.message.toLowerCase().includes('rate limit') ||
			error.message.toLowerCase().includes('too many requests'),
		handler: async () => {
			// The shared corsair/http transport has already retried this 429
			// (up to 3 times, honoring Retry-After when parseable). Re-running
			// the endpoint here would multiply those attempts and replay
			// requests before the rate-limit window resets.
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)) ||
			error.message.toLowerCase().includes('unauthorized'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
