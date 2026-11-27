import type { CorsairErrorHandler } from 'corsair/core';
import { OmnisendAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof OmnisendAPIError ? error.status : undefined;
}

function typeOf(error: Error): string | undefined {
	return error instanceof OmnisendAPIError ? error.problemType : undefined;
}

/** Milliseconds from the 429 delay, taken from the problem body's retryAfter. */
function retryAfterOf(error: Error): number | undefined {
	return error instanceof OmnisendAPIError ? error.retryAfter : undefined;
}

export const errorHandlers = {
	// 402: the campaign audience exceeds the brand's billing tier (email credits
	// or subscriber count). No retry can fix it; upgrade or shrink the audience.
	// Declared before RATE_LIMIT_ERROR so a billing refusal is never mistaken
	// for a throughput limit.
	BILLING_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: the key is wrong, revoked, or lacks the route's scope.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's scopes do not cover this route.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown id.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 410: the request named a retired API version in Omnisend-Version.
	GONE_ERROR: {
		match: (error: Error) => statusOf(error) === 410,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 or 422: a malformed body or an unknown event name. A retry sends the
	// same thing. 422 also covers campaign creation without a verified sender.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' || status === 400 || status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: a conflict, such as a campaign update outside draft status or an
	// event property type that collides with a declared one.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: limits are per brand on a sliding window, shared across every key.
	// The delay arrives in the problem body's `retryAfter` (seconds); a minute
	// is the fallback when none was sent, since the default window is per
	// minute. Some routes are far tighter (segment writes 15/min, analytics
	// POST 55 per 24 hours), which the real value covers when present.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 ||
			typeOf(error)?.endsWith('/rate-limit-exceeded') === true,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error) ?? 60_000,
		}),
	},
	/**
	 * 5xx: retried with backoff, but only where a replay cannot duplicate work.
	 *
	 * A POST is never replayed: batches.create would queue a second batch, and
	 * events.send is append-only. A GET always is. A PATCH, PUT or DELETE is
	 * replayed only because each is addressed by an id, so a repeat lands on
	 * the same resource rather than creating a second one.
	 */
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof OmnisendAPIError && error.method === 'POST' ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached the provider, so a read is replayed
	// and a write waits for the caller instead.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof OmnisendAPIError &&
			(error.status === 408 || error.name === 'TimeoutError'),
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof OmnisendAPIError && error.method === 'GET' ? 2 : 0,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof OmnisendAPIError &&
			error.status === undefined &&
			error.method !== undefined,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof OmnisendAPIError && error.method === 'GET' ? 2 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys come first, so
// a caller handler for a status no builtin covers is the one that runs.
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
