import type { CorsairErrorHandler } from 'corsair/core';
import { HeyyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof HeyyAPIError ? error.status : undefined;
}

function keyOf(error: Error): string | undefined {
	return error instanceof HeyyAPIError ? error.messageKey : undefined;
}

// Status codes and the error envelope:
// https://docs.heyy.io/api-reference/v3/error-handling
export const errorHandlers = {
	// 401 `unauthorized`: the bearer token is missing, expired or revoked.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || keyOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 `*_not_found`: a contact, label, attribute or webhook id that does not
	// exist. The body names which, in `messageKey`.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: invalid fields or a type mismatch. For a partially failed multi-id
	// delete the API answers 200 with `notFoundIds` instead, so a 400 here is a
	// request that has to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 `rate_limit_exceeded`: the limit is per minute per tenant. Heyy sends
	// X-RateLimit-Reset rather than Retry-After, and the client turns that
	// timestamp into a delay; a full minute is the fallback when it is absent.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || keyOf(error) === 'rate_limit_exceeded',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				(error instanceof HeyyAPIError ? error.retryAfter : undefined) ??
				60_000,
		}),
	},
	// 5xx: Heyy says to retry with exponential backoff. Every operation here is
	// safe to replay. The creates are not addressed by a caller-supplied id, so a
	// replay after a 5xx can leave a duplicate row, but the alternative is a
	// caller who never learns their write succeeded, and the API answered 5xx
	// only after rejecting the request at the gateway or crashing mid-request.
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
	// A dropped connection never reached the provider, so a read is replayed and
	// a write waits for the caller instead.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(statusOf(error) === undefined && error.name === 'TimeoutError'),
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof HeyyAPIError && error.method === 'POST' ? 0 : 2,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof HeyyAPIError &&
			error.status === undefined &&
			error.method !== undefined,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof HeyyAPIError && error.method === 'POST' ? 0 : 2,
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
