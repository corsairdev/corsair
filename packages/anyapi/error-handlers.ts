import type { CorsairErrorHandler } from 'corsair/core';
import { AnyApiAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof AnyApiAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof AnyApiAPIError ? error.code : undefined;
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

function retryAfterOf(error: Error): number | undefined {
	return error instanceof AnyApiAPIError ? error.retryAfter : undefined;
}

// Status codes: https://api.getanyapi.com/openapi.json (any /v1/run/{sku}).
// AnyAPI bills a run only when it returns data, except when the error body
// carries `payment` (charged_undelivered or indeterminate). Those are never
// retried here, because a retry could pay twice.
export const errorHandlers = {
	// 400 invalid input, 404 unknown SKU or expired result, 422 an endpoint
	// that cannot serve the target (the message lists alternatives). A retry
	// sends the same input. AnyAPI charges nothing for these.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: the API key is missing or invalid.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the wallet (or the free trial budget) cannot pay for the call.
	// Waiting does not add funds.
	INSUFFICIENT_FUNDS_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is read-only or run-only.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The request may have been charged without returning data.
	CHARGED_ERROR: {
		match: (error: Error) => error instanceof AnyApiAPIError && error.charged,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 idempotency_in_progress: the same Idempotency-Key is still running.
	// Retrying after Retry-After returns its result without paying again.
	// Other 409 codes mean the key was reused for a different request.
	IDEMPOTENCY_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async (error: Error) =>
			codeOf(error) === 'idempotency_in_progress'
				? {
						maxRetries: 3,
						headersRetryAfterMs: retryAfterOf(error),
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 },
	},
	// 429: the upstream was rate limited. AnyAPI asks for the same request
	// again after Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A request that timed out may have finished, and been billed, after the
	// client gave up, so it is not replayed.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 504 ||
			(statusOf(error) === undefined && timedOut(error)),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500/502 with no payment in the body: every source failed and nothing
	// was charged.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
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
