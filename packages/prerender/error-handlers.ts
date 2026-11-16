import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isCredentialRejection,
	isReplayablePath,
	PrerenderAPIError,
} from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Prerender has no published error taxonomy: every route probed answers a plain
// text reason with a 400, and the cache-clear route documents a 403 for "already
// in progress". HTTP failures arrive as core's ApiError; only a request that
// never reached Prerender arrives as a PrerenderAPIError.
export const errorHandlers = {
	// `Invalid prerenderToken` on any route.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			isCredentialRejection(error.status, error.body),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 400: a body Prerender refused as written. A 401 is not documented
	// but is treated the same way rather than falling through.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 401;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 on cache clear means a job is already queued or running. A retry
	// right away cannot help, since only one job runs at a time.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The search route documents 50 requests a minute and answers 429 past it,
	// before doing any work, so any route may wait and try again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	// A ZodError is the plugin's own validation and needs no retry.
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection may still have reached Prerender. Only reads and the
	// speed change are repeated: a second recache or sitemap submit spends renders
	// again, and a second clear deletes pages cached since the first one.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PrerenderAPIError && error.transport,
		handler: async (error: Error) =>
			error instanceof PrerenderAPIError && error.replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// The same rule covers a 5xx, which can arrive after the work was done.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.status >= 500 &&
			isReplayablePath(error.request.url),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx on a route that must not repeat, and anything unrecognised.
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
