import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PostizAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** The HTTP method of the failed request; every read here is a GET. */
function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	if (error instanceof PostizAPIError) return error.method;
	return undefined;
}

// Postiz documents its status codes explicitly, including one quirk this map
// has to respect: a delete of something already gone answers 404, and a known
// bug surfaces a missing post id as a 500. Neither is retried.
export const errorHandlers = {
	// `No API Key found`, `Invalid API key`, or any other 401. No retry sends a
	// different key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A valid key that does not own the resource, such as another
	// organisation's post.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Core's request() has already retried the 429 three times, honouring
	// Retry-After, before this sees it. The create-post route allows 90-100
	// requests an hour for the whole instance, so another round here would only
	// spend more of that budget.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
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
			maxRetries: methodOf(error) === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Postiz says a 5xx should be retried with backoff, but only a read is safe:
	// a failed publish may still have reached the platform. A known bug answers
	// a missing post id as a 500, so a write is never replayed here.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
