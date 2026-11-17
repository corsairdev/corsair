import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

const hasStatus = (error: Error, ...statuses: number[]) =>
	error instanceof ApiError && statuses.includes(error.status);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => hasStatus(error, 429),
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => hasStatus(error, 401),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => hasStatus(error, 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || hasStatus(error, 400, 404, 422),
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
