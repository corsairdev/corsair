import type { CorsairErrorHandler } from 'corsair/core';
import { SimilarwebAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SimilarwebAPIError ? error.status : undefined;
}

/**
 * Status codes: https://developers.similarweb.com/docs/error-codes-rest
 *
 * Similarweb allows 10 requests per second per account and answers 429 past it.
 * It documents no Retry-After header, so a 429 falls back to backoff.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Similarweb refused the request before running it, so a GET is safe to
		// replay, and every route here is a GET.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SimilarwebAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 and 403 both mean the request cannot be authorised: the key is
	// missing or invalid, or the account is out of data credits. Neither
	// improves on a retry. Similarweb documents no way to tell a bad key from
	// an exhausted balance, so a caller should check both on the account page.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SimilarwebAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is "Data not found": a domain or app with no data, or a mistyped
	// domain. Similarweb answers 401 for a capitalised domain, so this only
	// catches the ones it recognises as a known shape with no data.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof SimilarwebAPIError && error.isDataNotFound,
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
		match: (error: Error) =>
			error instanceof SimilarwebAPIError && (error.status ?? 0) >= 500,
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
