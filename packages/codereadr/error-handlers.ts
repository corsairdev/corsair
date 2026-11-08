import type { CorsairErrorHandler } from 'corsair/core';
import { CodereadrAPIError } from './client';

function codeOf(error: Error): number | undefined {
	return error instanceof CodereadrAPIError ? error.code : undefined;
}

/**
 * CodeREADr error codes. See
 * https://developer.codereadr.com/1.0/reference/error-codes/
 *
 * The API answers HTTP 200 for these, so the code in the body is the only
 * signal; there is no status to classify on.
 */
export const errorHandlers = {
	// Codes 111 (per-minute) and 113 (per-day). The docs say blocked calls are
	// reset every minute and can be resent, so a retry is the documented
	// behavior. The minute counter resets at the top of each minute, which the
	// handler cannot know, so it waits the documented window.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof CodereadrAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			// No Retry-After header exists; a minute is the documented window.
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 100 invalid key, 101 missing key. Repeating the request changes nothing.
	AUTH_ERROR: {
		match: (error: Error) => codeOf(error) === 100 || codeOf(error) === 101,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 10 no permission for the action on this account's plan.
	PERMISSION_ERROR: {
		match: (error: Error) => codeOf(error) === 10,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Code 2 is CodeREADr's own "could not be processed, our team has been
	// notified", and a 5xx is the same class of transient failure. Only calls
	// marked replay-safe are repeated, because an unmarked write may already
	// have been applied; a replayed write could double-delete or double-create.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof CodereadrAPIError &&
			error.replaySafe &&
			(error.code === 2 || (error.status ?? 0) >= 500),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Every other documented code is a request the provider rejected: a missing
	// or invalid variable, an unknown record, a duplicate name, a URL that is
	// not absolute. Zod failures land here too. Resending sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(error instanceof CodereadrAPIError && error.code !== undefined),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. A user handler under a
// new name has to come before the builtin keys, or a builtin match would claim
// the error first and the caller's retry policy would never run.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...userRest, ...builtinRest, DEFAULT: fallback }
		: { ...userRest, ...builtinRest };
}
