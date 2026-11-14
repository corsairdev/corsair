import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isCredentialRejection,
	PrismicAPIError,
	readFieldErrors,
} from './client';

// Prismic's answers arrive as core's ApiError; PrismicAPIError is a request
// that got no answer, so it has no status.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	return error instanceof PrismicAPIError ? error.method : undefined;
}

// The two Prismic APIs share status codes with different meanings, so the
// handlers read the body where the status alone would mislead.
export const errorHandlers = {
	// The Content API's 401 on a private repository without a valid access
	// token, or the Migration API's access-denied 403 on a bad write token.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			isCredentialRejection(error.status, error.body),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 on either API. The Content API allows 200 requests a second; the
	// Migration API allows one a second per repository. Core's request() has
	// already retried it, honouring Retry-After, so it is not retried again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// A request Prismic refused: the Content API's `api_validation_error` (400),
	// an unknown repository (404), or the Migration API's array naming each bad
	// property. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422 ||
				(error instanceof ApiError && readFieldErrors(error.body) !== undefined)
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
			maxRetries: methodOf(error) === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed, for the same reason.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
