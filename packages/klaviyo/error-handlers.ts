import type { CorsairErrorHandler } from 'corsair/core';
import { KlaviyoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof KlaviyoAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof KlaviyoAPIError ? error.code : undefined;
}

// Status codes: https://developers.klaviyo.com/en/reference/errors
export const errorHandlers = {
	// 401 `authentication_failed`: the private key is wrong, revoked, or for
	// another account.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || codeOf(error) === 'authentication_failed',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's scopes do not cover this route. Klaviyo scopes a private key
	// at creation and will not let it be widened afterwards.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown id.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: a malformed body or a filter expression Klaviyo cannot parse. A retry
	// sends the same thing.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: a conflict such as a duplicate list name or a tag that already exists.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: Klaviyo runs a burst and a steady window per account. It sends
	// Retry-After, which the client copies onto the error; a minute is the
	// fallback when the steady window closes.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || codeOf(error) === 'rate_limit_exceeded',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				(error instanceof KlaviyoAPIError ? error.retryAfter : undefined) ??
				60_000,
		}),
	},
	/**
	 * 5xx: retried with backoff, but only where a replay cannot duplicate work.
	 *
	 * A POST is never replayed: it creates something, and Klaviyo has already acted
	 * on the request by the time it answers 5xx. A GET always is. A PATCH or DELETE
	 * is replayed only because both are addressed by an id, so a repeat lands on the
	 * same resource rather than creating a second one.
	 */
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KlaviyoAPIError && error.method === 'POST' ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached the provider, so a read is replayed and
	// a write waits for the caller instead.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof KlaviyoAPIError &&
			(error.status === 408 || error.name === 'TimeoutError'),
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KlaviyoAPIError && error.method === 'GET' ? 2 : 0,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof KlaviyoAPIError &&
			error.status === undefined &&
			error.method !== undefined,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KlaviyoAPIError && error.method === 'GET' ? 2 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys come first, so a
// caller handler for a status no builtin covers is the one that runs.
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
