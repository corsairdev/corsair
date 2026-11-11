import type { CorsairErrorHandler } from 'corsair/core';
import { YnabAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof YnabAPIError ? error.status : undefined;
}

/**
 * YNAB answers `{ error: { id, name, detail } }`, where `id` repeats the HTTP
 * status as a string. Its docs note a 429 carries `Retry-After`, and that a
 * malformed delta request is rejected outright rather than partly applied —
 * which is why a 400 is never retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof YnabAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof YnabAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the token is missing, wrong or revoked. YNAB does not distinguish.
	AUTH_ERROR: {
		match: (error: Error) => error instanceof YnabAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the subscription lapsed, so the account is read-only until it is
	// renewed — nothing about the request can fix it.
	SUBSCRIPTION_LAPSED_ERROR: {
		match: (error: Error) =>
			error instanceof YnabAPIError && error.isSubscriptionLapsed,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof YnabAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad_request, 409 conflict, 422, and a ZodError from the input schema.
	// A delta request is rejected whole, so a retry sends the same bad body.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creating a transaction or moving money between
	// categories is not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof YnabAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
