import type { CorsairErrorHandler } from 'corsair/core';
import { HotspotSystemAPIError, HotspotSystemTransportError } from './client';

function failure(error: Error): HotspotSystemAPIError | undefined {
	return error instanceof HotspotSystemAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return failure(error)?.status;
}

/**
 * Every operation in this API is a GET, so a replay cannot duplicate anything.
 * The provider documents no write operation to protect, which is what makes
 * this simpler than the usual split.
 */
export const errorHandlers = {
	// 401: the key is wrong, revoked, or not the resource owner's. This is the
	// only auth failure the API documents, and it says `Invalid authentication!`
	// for every cause.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403, when a proxy or a future version answers it: the key is genuine but
	// not allowed here.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown location ID, or a resource this key cannot see.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and a rejected input schema: a malformed query value. The documented
	// query parameters are strings, and `fields` or `sort` naming a property the
	// resource does not have is the caller's mistake.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422, when answered: a body the provider refuses. Nothing here sends one,
	// but a gateway can still report it.
	VALIDATION_ERROR: {
		match: (error: Error) => statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if a gateway in front of the API rate limits. The API documents no
	// budget, so `Retry-After` is honoured when present and a short backoff is
	// used when it is not.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			const wait = failure(error)?.retryAfter;
			return wait !== undefined && wait > 0
				? { maxRetries: 3, headersRetryAfterMs: wait }
				: { maxRetries: 3, retryStrategy: 'exponential_backoff' as const };
		},
	},
	// 500 is documented on every operation as `{"error": "Internal Server
	// Error"}`, and it is the only 5xx the API itself names. Reads only, so a
	// replay is always safe.
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
	// The client's own timeout, which it records because the name that
	// identified it is lost when the failure is re-thrown.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(error instanceof HotspotSystemTransportError && error.timedOut),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// A reset connection or a DNS failure: the request never reached the
	// provider, so a GET is safe to repeat. A timeout is excluded here because
	// TIMEOUT_ERROR names it.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof HotspotSystemTransportError && !error.timedOut,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys go first: a
// caller handler for a status no builtin covers would otherwise never run,
// because the trailing DEFAULT claims that error first.
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
