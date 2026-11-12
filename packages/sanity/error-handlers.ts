import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SanityAPIError, SanityError } from './client';

// Longest Retry-After worth sleeping through inside a Corsair script.
const LONGEST_RETRY_WAIT_MS = 10_000;

/**
 * Reads change nothing, so asking again is always safe. A query goes as a POST
 * but only reads; every other POST, PUT, PATCH or DELETE writes, and Sanity
 * may have applied it before failing (an `inc` or a create would then run twice).
 */
export function isRead(error: Error): boolean {
	const call =
		error instanceof SanityAPIError
			? { method: error.request.method, path: error.request.url }
			: error instanceof SanityError
				? error.request
				: undefined;
	if (!call) return false;
	return call.method === 'GET' || call.path.startsWith('/data/query/');
}

/** Agent Actions answer 429 when the plan or AI budget is used up, which waiting doesn't fix. */
function isAgentAction(error: Error): boolean {
	return (
		error instanceof SanityAPIError &&
		error.request.url.startsWith('/agent/action/')
	);
}

function retryAfterItsWait(error: Error): RetryStrategy {
	const wait = error instanceof ApiError ? error.retryAfter : undefined;
	if (wait !== undefined && wait > LONGEST_RETRY_WAIT_MS) {
		return { maxRetries: 0 };
	}
	return {
		maxRetries: 3,
		retryStrategy: 'exponential_backoff_jitter',
		headersRetryAfterMs: wait,
	};
}

const hasCode = (error: Error, code: SanityError['code']) =>
	error instanceof SanityError && error.code === code;

export const errorHandlers = {
	// Sanity refused the request (25 mutations a second per IP, 500 requests in
	// all), so nothing ran and a retry is safe for writes too.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.status === 429 &&
			!isAgentAction(error),
		handler: async (error: Error) => retryAfterItsWait(error),
	},
	// 401: missing, wrong or expired token. 403: the role can't do this, or AI
	// features are off. Asking again changes neither.
	AUTH_ERROR: {
		match: (error: Error) =>
			hasCode(error, 'invalid_key') ||
			hasCode(error, 'missing_project') ||
			(error instanceof ApiError &&
				(error.status === 401 || error.status === 403)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError && error.status >= 500 && isRead(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	// The request never reached Sanity, or its answer never came back. Only a
	// read is asked again: a write may have landed.
	NETWORK_ERROR: {
		match: (error: Error) => hasCode(error, 'network') && isRead(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) => hasCode(error, 'timeout') && isRead(error),
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_1s' as const,
		}),
	},
	// 400, 404, 409 and the rest need the request changed. Core falls back to
	// DEFAULT by name once nothing else matches, so this one matches nothing
	// itself and its place in the list can't hide another handler.
	DEFAULT: {
		match: () => false,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
