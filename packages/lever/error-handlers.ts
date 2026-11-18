import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { LeverAPIError } from './client';

type StatusError = ApiError | LeverAPIError;

const isStatusError = (error: Error): error is StatusError =>
	error instanceof ApiError || error instanceof LeverAPIError;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 429,
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (isStatusError(error) && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
