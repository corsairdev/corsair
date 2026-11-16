import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isSimilarwebDataNotFound } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Status codes: https://developers.similarweb.com/docs/error-codes-rest
 *
 * Similarweb allows 10 requests per second per account and answers 429 past it.
 * Core retries a 429 three times; it documents no Retry-After header, so the
 * retries fall back to backoff.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Core's request() already retried it three times with backoff.
		handler: async () => ({ maxRetries: 0 }),
	},
	// "Data not found": a domain or app with no data, or a mistyped or
	// capitalised domain. Similarweb sends it as a 401 (its error-code page)
	// or a 404, so this runs before AUTH_ERROR claims the 401.
	NOT_FOUND_ERROR: {
		match: (error: Error) => isSimilarwebDataNotFound(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 and 403 both mean the request cannot be authorised: the key is
	// missing or invalid, or the account is out of data credits. Neither
	// improves on a retry. Similarweb documents no way to tell a bad key from
	// an exhausted balance, so a caller should check both on the account page.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: a malformed parameter, such as a country code the
	// subscription does not include. Re-sending cannot change the answer.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Similarweb documents a 500 only as an internal error. Every route is a
	// read, so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. Caller keys come first so a
 * handler they added actually runs.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) {
			merged[name as keyof CorsairErrorHandler] = entry;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
