import type { CorsairErrorHandler } from 'corsair/core';
import { PostizAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PostizAPIError ? error.status : undefined;
}

// Postiz documents its status codes explicitly, including one quirk this map
// has to respect: a delete of something already gone answers 404, and a known
// bug surfaces a missing post id as a 500. Neither is retried.
export const errorHandlers = {
	// `No API Key found` or `Invalid API key`. No retry sends a different key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PostizAPIError && error.credentialsRejected,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401: the key is present but Postiz still refused it.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A valid key that does not own the resource, such as another
	// organisation's post.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The create-post route allows 90-100 requests an hour for the whole
	// instance. Postiz sends no Retry-After, so a minute is the floor.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const text = error.message.toLowerCase();
			return text.includes('too many requests') || text.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof PostizAPIError ? error.retryAfter : undefined,
			// An hourly budget will not reopen within a retry, so one longer wait
			// then a stop is more honest than three quick attempts.
			retryStrategy: 'linear_4s' as const,
		}),
	},
	// A malformed body or a path id that matches nothing. A 413 is a body over
	// the 50 MB limit, which a retry cannot shrink.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 413
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached Postiz, so a read is safe to replay. A
	// write is not, because a publish may already have gone out.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof PostizAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof PostizAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Postiz says a 5xx should be retried with backoff, but only a read is safe:
	// a failed publish may still have reached the platform. A known bug answers
	// a missing post id as a 500, so a write is never replayed here.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PostizAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
