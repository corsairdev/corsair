import type { CorsairErrorHandler } from 'corsair/core';
import { FreshBooksAPIError } from './client';

function asFreshBooksError(error: Error): FreshBooksAPIError | undefined {
	return error instanceof FreshBooksAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asFreshBooksError(error)?.status;
}

function methodOf(error: Error): string | undefined {
	return asFreshBooksError(error)?.method;
}

// Rate limiting: FreshBooks documents no numbers and no Retry-After contract
// (freshbooks.com/api/limits), only that too many calls in a short period get
// limited. Retry with the documented-less default backoff and let a real
// Retry-After header override the delay.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asFreshBooksError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 409 is the one documented retry case: creating invoices concurrently
	// without invoice_number can collide on the generated number, and the docs
	// say retrying succeeds. The failed create left nothing behind to duplicate.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 on any family: the access token is missing or expired (tokens last
	// 12 hours). A new token needs a fresh OAuth round-trip, not a retry.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 unknown account or record (the accounting
	// family answers a wrong accountId with 404 "Account not found"). The same
	// request would fail the same way again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// FreshBooks does not document 5xx behavior. Only reads are replayed: a
	// failed write may have gone through, and FreshBooks has no idempotency
	// keys. method is undefined only when the request never left (transport
	// failure), which is safe to replay for a read.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' &&
			((statusOf(error) ?? 0) >= 500 || statusOf(error) === undefined),
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
