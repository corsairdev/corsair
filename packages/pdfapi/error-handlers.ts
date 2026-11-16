import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

import { PdfApiError } from './client';

type StatusError = ApiError | PdfApiError;

const isStatusError = (error: Error): error is StatusError =>
	error instanceof ApiError || error instanceof PdfApiError;

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 429,
		// Core's request() already retried this 429 three times honouring
		// Retry-After (R8), so the handler does not retry it again.
		handler: async () => ({ maxRetries: 0 }),
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
