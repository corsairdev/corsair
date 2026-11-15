import type { CorsairErrorHandler } from 'corsair/core';
import { SurveymonkeyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SurveymonkeyAPIError ? error.status : undefined;
}

/**
 * SurveyMonkey answers a real HTTP status with a JSON envelope. The documented
 * classes are 400 for a rejected field or filter, 401 for a missing or invalid
 * token, 403 for a scope the token was not granted or a plan that does not
 * include it, 404 for a missing resource, and 429 when the request limit is hit.
 * A draft or private app gets 120 requests a minute and 500 a day, and the
 * response headers carry the remaining counts.
 *
 * This plugin has real writes, so a 5xx is only replayed for a `GET`: a create
 * that timed out may have committed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SurveymonkeyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a wrong or revoked token. 403 is a missing scope or a plan without
	// direct API access, which a retry cannot change.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SurveymonkeyAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an id or route that does not exist. It is terminal.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof SurveymonkeyAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a field or filter the API rejected, so the same body fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof SurveymonkeyAPIError && error.isValidation)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached the account, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SurveymonkeyAPIError &&
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
