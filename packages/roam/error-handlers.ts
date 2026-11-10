import type { CorsairErrorHandler } from 'corsair/core';
import { RoamAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RoamAPIError ? error.status : undefined;
}

/**
 * Roam's error taxonomy, from its error-codes guide. The body's `error` is a
 * catalog code, so most handlers key on it rather than the status:
 *
 * - `not_authed`, `invalid_token`, `token_revoked` are a missing or dead token.
 *   A revoked token must never be retried, because the integration is gone.
 * - `approval_pending` is a 403 naming a personal token that awaits an admin.
 *   The token is correct, so this is not an auth error to discard.
 * - `missing_scope` is a 403 that names the scopes needed. Retrying cannot add
 *   a scope, so it is a permission error rather than a rate-limit-shaped one.
 * - `not_found` is an unknown method, chat, user or meeting.
 * - `5xx` is only replayed for a call the endpoint declared replayable.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RoamAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A revoked token is permanent: the docs say to discard it, not retry.
	TOKEN_REVOKED_ERROR: {
		match: (error: Error) =>
			error instanceof RoamAPIError && error.code === 'token_revoked',
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => error instanceof RoamAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof RoamAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				(error instanceof RoamAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof RoamAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RoamAPIError &&
			error.replayable &&
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
 */
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
