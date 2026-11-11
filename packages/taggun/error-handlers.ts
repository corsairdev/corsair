import type { CorsairErrorHandler } from 'corsair/core';
import { TaggunAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TaggunAPIError ? error.status : undefined;
}

/**
 * Taggun is synchronous and billable per call, and its docs say explicitly that
 * operations are not idempotent. Only a read can be replayed. Taggun does not
 * publish a Retry-After, so `headersRetryAfterMs` is the fallback window; a real
 * header overrides it.
 */
const RATE_LIMIT_FALLBACK_MS = 1000;

export const errorHandlers = {
	// 429 `API rate limit exceeded`, or the same string from a gateway without
	// the 429 status. Limits are 5/s, 300/min and 2,000/hour, so a short backoff
	// can land inside the same second.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TaggunAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof TaggunAPIError && error.method === 'GET' ? 3 : 2,
			headersRetryAfterMs:
				error instanceof TaggunAPIError && error.retryAfter
					? error.retryAfter
					: RATE_LIMIT_FALLBACK_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 "No API key found in request" and 403 "Invalid authentication
	// credentials". Both are permanent until the key changes.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TaggunAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 naming the Campaign Validation feature is a plan limit, not bad
	// input, and no retry or input change fixes it.
	FEATURE_UNAVAILABLE_ERROR: {
		match: (error: Error) =>
			error instanceof TaggunAPIError && error.isFeatureUnavailable,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 413 request too large and 415 unsupported media type: the same bytes fail
	// again. 400 and 404 are bad input, a missing campaign, an unreachable URL,
	// or a receipt Taggun could not read.
	PAYLOAD_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error) ?? 0;
			return (
				status === 400 || status === 404 || status === 413 || status === 415
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A local schema rejection never reached Taggun, so nothing was billed.
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	// Taggun says to retry 500 and 502 with backoff when it is safe for the
	// operation, and that its operations are not idempotent. Every extraction
	// and validation call is billable and state-changing, so only GET replays.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error) ?? 0;
			return (
				error instanceof TaggunAPIError &&
				error.method === 'GET' &&
				status >= 500
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx on a write may have been processed and billed, so it is never
	// replayed: the caller reconciles with a read instead. Placed after
	// SERVER_ERROR, which already claims the reads.
	UPSTREAM_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error) ?? 0;
			return error instanceof TaggunAPIError && status >= 502;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A timeout is a dropped connection, never a provider verdict. A read is
	// safe to replay; a scan may have been billed, so a write is not.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof TaggunAPIError && error.isTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof TaggunAPIError && error.method === 'GET' ? 1 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Core runs the first handler whose `match` passes, so the merged key order is
// what decides which one wins. Caller keys go first, then any builtin they did
// not name, and DEFAULT last.
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
