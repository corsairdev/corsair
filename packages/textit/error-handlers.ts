import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Core's request() already retried a 429 three times; nothing here retries again,
// and 5xx or network errors are not replayed because a write may have landed.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof ApiError &&
				(error.status === 400 || error.status === 404)),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

export function mergeErrorHandlers(
	user?: CorsairErrorHandler,
): CorsairErrorHandler {
	if (!user) return errorHandlers;
	const { DEFAULT: builtinDefault, ...builtinRest } = errorHandlers;
	const { DEFAULT: userDefault, ...userRest } = user;
	return {
		...builtinRest,
		...userRest,
		DEFAULT: userDefault ?? builtinDefault,
	};
}
