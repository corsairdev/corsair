import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HiggsfieldAPIError, HiggsfieldError } from './client';

// Longest Retry-After worth sleeping through. A full queue can say 30 s, longer
// than a Corsair script has, so that answer goes back to the caller instead.
const LONGEST_RETRY_WAIT_MS = 10_000;

const hasCode = (error: Error, code: HiggsfieldError['code']) =>
	error instanceof HiggsfieldError && error.code === code;

/**
 * Core retries by calling the operation again with the same arguments, which
 * is safe for a generation: generations.submit and generations.run keep one
 * Idempotency-Key per argument object until Higgsfield accepts the request
 * (endpoints/generations.ts), and Higgsfield answers a repeat with the original
 * request instead of a second charge.
 */
export const errorHandlers = {
	// account_queue_full, or an endpoint limit. Nothing was created.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => {
			const wait = error instanceof ApiError ? error.retryAfter : undefined;
			if (wait !== undefined && wait > LONGEST_RETRY_WAIT_MS) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff_jitter' as const,
				headersRetryAfterMs: wait,
			};
		},
	},
	// 401: missing or wrong key. 403: the balance is too low. Asking again changes neither.
	AUTH_ERROR: {
		match: (error: Error) =>
			hasCode(error, 'invalid_key') ||
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500, 502 and 504 may or may not have run, which the docs say to repeat with
	// the same key. 503 is retried only when Higgsfield marks it retryable
	// (admission_control_unavailable): a disabled model stays disabled.
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status === 503 &&
				!(error instanceof HiggsfieldAPIError && error.retryable === true)
			) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff_jitter' as const,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error: Error) => hasCode(error, 'network'),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) => hasCode(error, 'timeout'),
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_1s' as const,
		}),
	},
	// 400, 404, 409, 422 and 423: the request needs changing, or time.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
