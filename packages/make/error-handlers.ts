import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;

export function mergeErrorHandlers(
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return errorHandlers;
	const { DEFAULT: defaultHandler, ...rest } = user;
	return {
		...errorHandlers,
		...rest,
		DEFAULT: defaultHandler ?? errorHandlers.DEFAULT,
	};
}
