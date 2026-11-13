import type { CorsairErrorHandler } from 'corsair/core';
import { MotionAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			return error instanceof MotionAPIError && error.status === 429;
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof MotionAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			return error instanceof MotionAPIError && error.status === 401;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
