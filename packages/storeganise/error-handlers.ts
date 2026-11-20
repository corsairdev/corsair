import type { CorsairErrorHandler } from 'corsair/core';
import { StoreganiseAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof StoreganiseAPIError ? error.status : undefined;
}

// The client retries a 429 up to three times through core, honouring
// Retry-After. No RATE_LIMIT_ERROR handler is needed here: DEFAULT adds no
// retries after the client has used its attempts.
// Documented statuses: 401 Unauthorized, 400 validation errors ("See the
// errors object in the response for more info").
// https://help.storeganise.com/article/331-system-error-list
export const errorHandlers = {
	// 401: a wrong or missing API key ("Not authorized" under type
	// "Unauthorized"), verified live on every admin route without a key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 unknown resource. A retry sends the same
	// request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: a retry of the one documented write
	// (unit-rentals custom fields) would run twice with no documented
	// idempotency contract.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StoreganiseAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
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
