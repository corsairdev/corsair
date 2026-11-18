import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleSearchConsoleTransportError } from './client';

function apiError(error: Error): ApiError | undefined {
	return error instanceof ApiError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return apiError(error)?.status;
}

/**
 * Search Console shares Google's error model, and its limits page documents the
 * two ways a call is refused for load:
 * https://developers.google.com/webmaster-tools/limits
 *
 * - The short-term load quota is exceeded: the docs say to wait 15 minutes or
 *   reduce the query's complexity. That is far longer than any retry loop, so
 *   the call reports it rather than stalling.
 * - `429` is the QPS/QPM/QPD quota for the site, user or project. Waiting can
 *   help, so it is retried with backoff.
 * - `403` is a property the credential cannot see, or a verification the
 *   account lacks. No retry grants access.
 * - `400` is a malformed query, including a dimension combined with a
 *   filter or a date range in the wrong order.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// 403: no access to the property, or the credential is not verified on it.
	// This is what a wrong siteUrl looks like, so it is not retried.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},

	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 400 is a malformed query or an invalid property name.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 5xx and 408. Replayed for reads only: a sitemap submit or a site add has a
	// side effect even though repeating it is usually harmless, and the plugin
	// does not need to gamble on that.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 408 || (status ?? 0) >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: apiError(error)?.request.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// A dropped connection never reached Google, so a read is safe to repeat.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GoogleSearchConsoleTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof GoogleSearchConsoleTransportError && error.isRead
					? 2
					: 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and core skips DEFAULT when looking for a named
 * match, so the caller's own handlers go first while DEFAULT stays last.
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
