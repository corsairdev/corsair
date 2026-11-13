import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SquareAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof SquareAPIError || error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function hasCategory(error: Error, category: string): boolean {
	return (
		error instanceof SquareAPIError &&
		error.errors.some((e) => e.category === category)
	);
}

// Core re-runs the endpoint on every retry, so a retry must never repeat a
// side effect. After a 5xx or a timeout the first attempt may have run, so only
// GET, PUT, DELETE, read-only POSTs and POSTs that carry the caller's
// idempotency_key are retried (Square's docs say the same key and request
// return the first response instead of acting twice). A keyless mutating POST
// is never retried.
function retrySafe(error: Error): boolean {
	return error instanceof SquareAPIError && error.retrySafe;
}

// No response at all (timeout, connection reset): the client wraps it in a
// SquareAPIError without a status.
function isTransportFailure(error: Error): boolean {
	return error instanceof SquareAPIError && error.status === undefined;
}

// Core takes the first handler whose match passes, so order matters.
export const errorHandlers = {
	// A declined card or refund is Square's answer, not a transient fault.
	PAYMENT_METHOD_ERROR: {
		match: (error: Error) =>
			hasCategory(error, 'PAYMENT_METHOD_ERROR') ||
			hasCategory(error, 'REFUND_ERROR'),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 was rejected, not run, so every method is retried, keyless writes
	// included. Square's OpenAPI spec lists no Retry-After header: honour one
	// only if it is present, otherwise back off exponentially.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || hasCategory(error, 'RATE_LIMIT_ERROR'),
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SquareAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TRANSIENT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				isTransportFailure(error) ||
				(status !== undefined && status >= 500 && status < 600)
			);
		},
		handler: async (error: Error) =>
			retrySafe(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// An expired, revoked or under-scoped token: sending it again cannot work.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				status === 401 ||
				status === 403 ||
				hasCategory(error, 'AUTHENTICATION_ERROR')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
