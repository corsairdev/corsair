import type { CorsairErrorHandler } from 'corsair/core';
import { PrismicAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PrismicAPIError ? error.status : undefined;
}

// The two Prismic APIs share status codes with different meanings, so the
// handlers read the body where the status alone would mislead.
export const errorHandlers = {
	// The Content API's `api_security_error`, or the Migration API's
	// access-denied 403 on a bad write token.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PrismicAPIError && error.credentialsRejected,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401: a repository that does not exist answers this way too, and
	// no retry changes either case.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 on either API. The Content API allows 200 requests a second; the
	// Migration API allows one a second per repository.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof PrismicAPIError ? error.retryAfter : undefined,
			retryStrategy: 'linear_1s' as const,
		}),
	},
	// A body Prismic refused: the Migration API answers an array naming each bad
	// property, which the error keeps as `fieldErrors`. A 400 or 422 from either
	// API is the same kind of problem.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422 ||
				(error instanceof PrismicAPIError && error.fieldErrors !== undefined)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached Prismic. A read is safe to replay; a
	// migration write is not, since the draft may already exist.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PrismicAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof PrismicAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed, for the same reason.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PrismicAPIError &&
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
 * Handlers match in key order and `DEFAULT` matches everything, so `DEFAULT`
 * stays last. A plain spread would keep a caller's value but a builtin's
 * position, which lets the trailing `DEFAULT` claim errors the caller named.
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
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
