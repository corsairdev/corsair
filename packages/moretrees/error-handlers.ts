import type { CorsairErrorHandler } from 'corsair/core';
import { MoreTreesAPIError } from './client';

function asMoreTreesError(error: Error): MoreTreesAPIError | undefined {
	return error instanceof MoreTreesAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMoreTreesError(error)?.status;
}

/**
 * Response codes: https://moretrees.eco/learn/user-guides/api (200, 201,
 * 400, 401, 403, 404, 406, 429, 500). The docs define no rate-limit window;
 * 429 is documented as "too many requests".
 */
export const errorHandlers = {
	// 429 is documented as rate limiting; no Retry-After window documented,
	// so exponential backoff carries the wait and a real header overrides it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMoreTreesError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 missing/invalid key, 403 forbidden (identity known to the server).
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed request, 404 unknown resource, 406 unacceptable content
	// type. The same request fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 406
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads are replayed; plant purchases are never replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMoreTreesError(error)?.replayable === true &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached More Trees, so a
	// read can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMoreTreesError(error)?.replayable === true &&
			asMoreTreesError(error)?.status === undefined,
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
