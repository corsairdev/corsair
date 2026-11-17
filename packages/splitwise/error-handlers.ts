import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Status codes: https://dev.splitwise.com/ ("Rate Limits" and the 401/403/404
// responses on every path). Splitwise documents one 429 behaviour: slow down
// and retry after a short delay, and does not say writes are idempotent.
export const errorHandlers = {
	// 429. Core's request() already retried it three times with Retry-After,
	// so it is not replayed again here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: a missing, wrong or revoked personal key, or an expired OAuth token.
	// The same request fails again, so it is not retried.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the current user is not on the group, expense or
	// friendship being read.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a body Splitwise rejects, 404 for an unknown id, and the plugin's
	// own errors: a failed 200 (`success: false`) and a Zod rejection of the
	// provider's answer. None of them get better on a second attempt.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				error.name === 'SplitwiseOperationError' ||
				status === 400 ||
				status === 404
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Splitwise does not document a transient-failure contract. Only reads are
	// replayed: a create, update or delete that reached the provider may have
	// applied, and create_expense is not idempotent (a replay adds a second
	// expense).
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys have to come first and DEFAULT stays last. Spreading the builtin first
// would keep a caller handler's value but not its position, and DEFAULT would
// claim every error before it was reached.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
