import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isCredentialRejection,
	ProabonoAPIError,
	readValidationErrors,
} from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ProabonoAPIError) return error.status;
	return error instanceof ApiError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ProabonoAPIError) return error.method;
	return error instanceof ApiError ? error.request.method : undefined;
}

function hasValidationErrors(error: Error): boolean {
	if (error instanceof ProabonoAPIError) {
		return error.validationErrors !== undefined;
	}
	return error instanceof ApiError
		? readValidationErrors(error.body) !== undefined
		: false;
}

// ProAbono has a small error taxonomy: a 401 for bad credentials, a 403 for a
// customer that cannot pay, a 422 carrying field errors, and a 404 for an id that
// matches nothing.
export const errorHandlers = {
	// `Error.AuthenticationFailed`.
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ProabonoAPIError) return error.credentialsRejected;
			return (
				error instanceof ApiError &&
				isCredentialRejection(error.status, error.body)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401: ProAbono refused the pair, which no retry changes.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 here is the documented "the customer has no valid payment
	// information" on a forced start, not a broken key. The request must change.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// ProAbono documents no rate limit, but a 429 from a proxy is still retryable.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	// A 422 carries a list of field errors, so it needs the request to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422 ||
				hasValidationErrors(error)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached ProAbono. A read is safe to replay; a
	// write is not, since a subscription or a usage may already exist.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof ProabonoAPIError && error.transport,
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
