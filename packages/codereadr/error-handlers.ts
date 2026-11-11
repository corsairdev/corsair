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
	// Code 113, the per-day limit. Its counter only resets at midnight, so a
	// retry a minute later is rejected again: it would hold the call open for
	// two more minutes and spend two more requests to return the same error.
	// It has to sit before RATE_LIMIT_ERROR, which also matches 113.
	DAILY_LIMIT_ERROR: {
		match: (error: Error) => codeOf(error) === 113,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Code 111 (per-minute), plus an HTTP 429 from a gateway in front of the
	// API. The docs say the minute counter resets at the start of every minute
	// and the call can be resent, so a retry is the documented behavior. A real
	// Retry-After wins when the server sent one; a minute is the fallback
	// because the counter resets at a boundary the handler cannot know.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof CodereadrAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof CodereadrAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: 60_000,
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
	// A connection reset, DNS failure or timeout gave no answer, so the outcome
	// is unknown. Retrying requires `replaySafe`, because a write whose response
	// was lost may already have been applied on the server.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof CodereadrAPIError && error.transport && error.replaySafe,
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
//
// A caller that reuses a builtin name, such as `RATE_LIMIT_ERROR`, must also
// win on values. A plain `{ ...user, ...builtin }` would keep the caller's
// position but restore the builtin handler under it, silently ignoring a
// `maxRetries: 0` that was meant to turn retries off.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const merged: CorsairErrorHandler = {};
	const keys = [
		...Object.keys(user).filter((key) => key !== 'DEFAULT'),
		...Object.keys(builtin).filter(
			(key) => key !== 'DEFAULT' && !(key in user),
		),
	];
	for (const key of keys) {
		const entry = key in user ? user[key] : builtin[key];
		if (entry) merged[key] = entry;
	}
	const fallback = user.DEFAULT ?? builtin.DEFAULT;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
