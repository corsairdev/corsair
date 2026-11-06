import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { RenderAPIError } from './client';

type StatusError = ApiError | RenderAPIError;

const isStatusError = (error: Error): error is StatusError =>
	error instanceof ApiError || error instanceof RenderAPIError;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 429,
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (isStatusError(error) && error.retryAfter !== undefined) {
				retryAfterMs = Math.min(error.retryAfter, 60_000);
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
