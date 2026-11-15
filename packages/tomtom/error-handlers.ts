import type { CorsairErrorHandler } from 'corsair/core';
import { TomTomAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TomTomAPIError ? error.status : undefined;
}

/**
 * TomTom's documented failure set:
 *
 * - 400 for a malformed query or coordinates
 * - 401 for a missing or invalid key
 * - 403 for a key that does not cover the product or the region
 * - 404 for a route or location that does not exist
 * - 429 for the daily or per-second quota, with `Retry-After`
 * - 5xx, which TomTom may answer during an outage
 *
 * Every wrapped route is a GET over map data, so replaying any of them is safe.
 */
export const errorHandlers = {
	// 429, which can be a per-second burst limit or the daily free quota. The
	// daily quota resets at midnight, so a retry still helps within the window
	// only when TomTom says so through Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TomTomAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TomTomAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a missing, wrong or expired key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the plan does not include the product or the
	// region asked for.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof TomTomAPIError && error.isPermission,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a malformed query, 404 for a location or route that does not
	// exist, and the plugin's own Zod rejection.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Every wrapped route is a GET, so a replay cannot repeat a write.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TomTomAPIError && (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys come first and DEFAULT stays last.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
