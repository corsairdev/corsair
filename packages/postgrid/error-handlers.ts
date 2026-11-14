import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isCredentialRejection, PostgridAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof PostgridAPIError) return error.status;
	return error instanceof ApiError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof PostgridAPIError) return error.method;
	return error instanceof ApiError ? error.request.method : undefined;
}

// PostGrid's error codes are documented as stable, so handlers match those
// rather than message text wherever a code exists.
export const errorHandlers = {
	// A rejected or missing key: `missing_auth_error`, `invalid_api_key_error` or
	// `invalid_oauth_token_error`. No retry sends a different key.
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof PostgridAPIError) return error.credentialsRejected;
			return (
				error instanceof ApiError &&
				isCredentialRejection(error.status, error.body)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401 or 403: the key exists but PostGrid refused the request, and
	// no retry can fix that either.
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The limits are per verb: 1000/min for a create, 50/min for a read and
	// 10/min for a list. PostGrid sends no Retry-After, so the fallback is a
	// second and the strategy doubles from there.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	// A body PostGrid refused as written: a validation error, an address it could
	// not verify, or a missing route. Each needs the request to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached PostGrid, so a read is safe to replay.
	// A write is not, unless the caller supplied its own idempotency key, which
	// the plugin cannot see here; so a write is never replayed.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PostgridAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: methodOf(error) === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed for the same reason.
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
