import type { CorsairErrorHandler } from 'corsair/core';
import { TextItAPIError } from './client';

// TextIt tells callers how long to wait but does not promise writes can be replayed.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TextItAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof TextItAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TextItAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof TextItAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof TextItAPIError &&
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
