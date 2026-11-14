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
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

export function mergeErrorHandlers(
	user?: CorsairErrorHandler,
): CorsairErrorHandler {
	if (!user) return errorHandlers;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: fallback, ...defaults } = errorHandlers;
	return {
		...userRest,
		...Object.fromEntries(
			Object.entries(defaults).filter(([name]) => !(name in userRest)),
		),
		DEFAULT: userDefault ?? fallback,
	};
}
