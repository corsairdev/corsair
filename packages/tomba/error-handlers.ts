import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isQuotaExhausted, tombaErrorType } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Tomba's documented failure set, from the Errors page and every operation's
 * response list:
 *
 * - 400 for missing, malformed or expired credentials, and for a parameter or
 *   plan rule the request broke
 * - 401 for a well-formed key that does not match, or an expired subscription
 * - 402 for a balance lower than the cost of the request
 * - 403 for a blocked account or a plan that excludes the endpoint
 * - 422 for a parameter that failed validation
 * - 429 for a rate limit, which names the window in its message
 * - 451 when the person asked Tomba to stop processing their data
 * - 500, which the docs say to retry with backoff
 *
 * The client lets core's ApiError through (rebuilt only to drop the looked-up
 * email or name from the request it carries), so these match its status and
 * the `errors.type` in its body.
 */
export const errorHandlers = {
	// 402 (or `quota_exceeded`): the balance is short. No retry can fix it, and
	// Tomba charges nothing for the attempt.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 ||
			tombaErrorType(error) === 'quota_exceeded' ||
			tombaErrorType(error) === 'insufficient_credits',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 451: the data is withheld permanently at the person's request. Repeating
	// the call is inappropriate, not just useless.
	LEGAL_BLOCK_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 451 || tombaErrorType(error) === 'legal_block',
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 for a used-up daily limit or count/sources balance. Nothing changes
	// before midnight UTC, and its Retry-After can be hours, so no retry.
	QUOTA_EXHAUSTED_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 &&
			error instanceof ApiError &&
			isQuotaExhausted(error.body),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A per-second or per-minute 429. The client turns core's own 429 loop off,
	// so this is the only retry: three times, after Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 400 `authentication_failed`/`api_key_expired` and 401. A missing,
	// malformed or expired credential answers 400, so the type identifies it.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			tombaErrorType(error) === 'authentication_failed' ||
			tombaErrorType(error) === 'api_key_expired',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: a blocked account, or a plan that does not include the endpoint.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a rule the request broke, 422 for a parameter that failed
	// validation, and the plugin's own Zod rejection. `unknown_record` arrives
	// here too: a webmail or disposable domain is refused, not found empty.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				error.name === 'TombaOperationError' ||
				status === 400 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500, which the docs explicitly say to retry with backoff. Every wrapped
	// route only reads (`reveal/search` is a POST search), so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
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
 * A request the plugin refused before sending, or a missing credential. Kept
 * separate from `TombaAPIError` so a caller can tell "the provider said no" from
 * "we never asked".
 */
export class TombaOperationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TombaOperationError';
	}
}

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys come first and DEFAULT stays last.
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
