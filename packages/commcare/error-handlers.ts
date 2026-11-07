import type { CorsairErrorHandler } from 'corsair/core';
import { CommCareAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CommCareAPIError ? error.status : undefined;
}

function replaySafeOf(error: Error): boolean {
	return error instanceof CommCareAPIError && error.replaySafe === true;
}

// Documented error codes: 400 bad request, 401 bad credentials, 403
// forbidden, 404 unknown resource, 410 gone, 422 unprocessable, 5xx server
// errors. No rate-limit behavior is documented.
export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	GONE_ERROR: {
		match: (error: Error) => statusOf(error) === 410 || statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads marked replaySafe in client.ts are retried. Creating a
	// mobile worker or submitting a form may have gone through.
	SERVER_ERROR: {
		match: (error: Error) =>
			replaySafeOf(error) && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
