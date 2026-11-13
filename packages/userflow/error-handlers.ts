import type { CorsairErrorHandler } from 'corsair/core';
import { UserflowAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof UserflowAPIError ? error.status : undefined;
}

/**
 * Error codes and statuses: https://userflow.com/docs/api#errors
 *
 * Every failure is `{ error: { code, message, doc_url } }`. The two APIs have
 * distinct key types, and report them with distinct codes: `invalid_api_key`
 * for an environment key on the Users API, `invalid_pak` for a personal key on
 * the Accounts API.
 */
export const errorHandlers = {
	// Per account per minute, depending on plan. The request was refused, so a
	// write can safely be retried.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof UserflowAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof UserflowAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401, or either key-type code. A different key has to be supplied, so a
	// retry cannot help.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof UserflowAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but lacks the permission for this account or
	// environment.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: a URL that does not exist, or a resource that is gone.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 406 (asked for a non-JSON format), 415 (missing Content-Type) and a
	// ZodError from the input schema. None of them changes on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 406 ||
				status === 415 ||
				status === 405
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500 and 503. The docs say a 503 comes from the concurrency limiter after
	// the request waited more than 15 seconds, so it never ran and can be
	// retried. A 500 is only replayed for a read: users.upsert and
	// events.track are not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof UserflowAPIError &&
			((error.status ?? 0) >= 500 || error.status === 503),
		handler: async (error: Error) => {
			const replayable =
				error instanceof UserflowAPIError && error.method === 'GET';
			return replayable
				? {
						maxRetries: 2,
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 };
		},
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
