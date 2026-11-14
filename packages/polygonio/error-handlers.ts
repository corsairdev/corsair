import type { CorsairErrorHandler } from 'corsair/core';
import { PolygonioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PolygonioAPIError ? error.status : undefined;
}

// Every route is a read: this API serves market data and nothing else, so the
// handlers never have to reason about replaying a write.
export const errorHandlers = {
	// A missing or unrecognised key. The client sets the flag when the body names
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PolygonioAPIError && error.credentialsRejected,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 401: the key exists but the API still refused the request, which
	// no retry can fix either. It sits after AUTH_ERROR so the specific case wins.
	UNAUTHORIZED_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The free tier allows a small number of calls a minute. The API documents
	// no Retry-After, so the fallback delay is the documented window.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const text = error.message.toLowerCase();
			return (
				text.includes('too many requests') ||
				text.includes('maximum requests per minute')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof PolygonioAPIError ? error.retryAfter : undefined,
			// The provider names a per-minute budget, so a fixed second is the
			// floor rather than an escalating delay that could still land inside it.
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// A key that exists but whose plan does not include this dataset, or a
	// per-ticker entitlement the account lacks.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The API answered 200 but says ERROR in the body, which is how it reports a
	// route or filter it rejected. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached the API, and every route is a read, so
	// a replay is safe.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PolygonioAPIError && error.transport,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx is the provider's own failure and the request was a read.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PolygonioAPIError && (error.status ?? 0) >= 500,
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
