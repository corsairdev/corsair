import type { CorsairErrorHandler } from 'corsair/core';
import { UserlistAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof UserlistAPIError ? error.status : undefined;
}

/**
 * Statuses: https://userlist.com/docs/developers/push-api/#errors
 *
 * Every failure is `{ status, code, errors: [...] }`. The request was only
 * queued on a `202`, so a 4xx means nothing was applied, while a 5xx may have
 * left the write half-done.
 */
export const errorHandlers = {
	// 1,000 requests a minute per account. Refused before the write, so a retry
	// cannot duplicate it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof UserlistAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof UserlistAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong Push key, or a key sent with the wrong scheme. The scheme is
	// `Push`, not `Bearer`.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof UserlistAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the plan does not include the feature being written.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 on a Push API path is a misconfigured route, not a missing object:
	// the API cannot look anything up.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 413: the 100 KB cap. The same body will always be refused, so the caller
	// has to send less rather than retry.
	PAYLOAD_TOO_LARGE_ERROR: {
		match: (error: Error) =>
			error instanceof UserlistAPIError && error.isTooLarge,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: the payload failed validation. `errors` says which fields.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof UserlistAPIError && error.isValidationError) ||
				status === 400
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The Push API has no reads, so no write is safe to replay blindly: a 5xx
	// may mean the payload was queued and the response lost. Nothing retries.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
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
