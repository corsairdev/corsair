import type { CorsairErrorHandler } from 'corsair/core';
import { RecruiteeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RecruiteeAPIError ? error.status : undefined;
}

/**
 * Recruitee's error taxonomy:
 *
 * - `401` is a missing, revoked or wrong-company token. A token is bound to one
 *   company, so using it for another answers 401; and a token cannot be
 *   regenerated, so this is always terminal.
 * - `403` is a valid token without the role to do this.
 * - `404` is an unknown candidate, offer or department.
 * - `422` is a rejected body: Recruitee validates a candidate and an offer.
 * - `429` is the documented **1000 requests per minute** per token. No
 *   `Retry-After` is documented, so the handler backs off on its own.
 * - `5xx` is only replayed for a read.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RecruiteeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RecruiteeAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 422 ||
				(error instanceof RecruiteeAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof RecruiteeAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RecruiteeAPIError &&
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
