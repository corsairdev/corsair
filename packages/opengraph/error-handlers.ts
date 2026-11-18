import type { CorsairErrorHandler } from 'corsair/core';
import { OpengraphAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof OpengraphAPIError ? error.status : undefined;
}

// Status codes: https://www.opengraph.io/docs/concepts/errors
export const errorHandlers = {
	// Limits are concurrent requests in flight, so a 429 was rejected before
	// the call ran and every operation is safe to replay. OpenGraph.io
	// documents exponential backoff and no Retry-After header; one is honored
	// anyway when sent.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof OpengraphAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof OpengraphAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a missing, wrong or rotated App ID. The docs' only fix is a new
	// key, so a retry sends the same bad credential.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the target site blocked the fetch. The fix is a proxy tier, not a
	// repeat of the same request.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad parameters or encoding, 404 target URL, 422 blocked by
	// ai_sanitize_mode=block or an unresolvable oEmbed. The request has to
	// change before a retry can work.
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
	// OpenGraph.io says to try 500, 502 and 503 again later. Only reads are
	// replayed, and every operation is a read; the POSTs (extract, query,
	// brand) are left alone because each attempt bills credits.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof OpengraphAPIError &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last. User keys order before builtin keys: core runs the first handler
// whose match passes, so a user handler under a new name must not lose to an
// overlapping builtin match. A user handler under a builtin name replaces it.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const key of Object.keys(builtinRest)) {
		if (!(key in merged)) {
			merged[key] = builtinRest[key];
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
