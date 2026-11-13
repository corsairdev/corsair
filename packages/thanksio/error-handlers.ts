import type { CorsairErrorHandler } from 'corsair/core';
import { ThanksIoAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ThanksIoAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ThanksIoAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ThanksIoAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof ThanksIoAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof ThanksIoAPIError &&
				(error.status === 400 || error.status === 404 || error.status === 422)),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
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
