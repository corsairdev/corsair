import type { CorsairErrorHandler } from 'corsair/core';
import { LemonSqueezyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof LemonSqueezyAPIError ? error.status : undefined;
}

// Statuses: https://docs.lemonsqueezy.com/api/getting-started/responses
export const errorHandlers = {
	// 429: the key's 300-a-minute budget is spent. The docs send no
	// Retry-After, so the fallback below is an exponential backoff, and a real
	// header overrides it when one arrives through a proxy.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LemonSqueezyAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LemonSqueezyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the key is missing, revoked or malformed. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's store does not include the feature, or test mode and live
	// mode are being mixed in a way the plan forbids.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown route or an id that does not belong to this key's store.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 carries the field-level validation failures. Lemon Squeezy names the
	// offending pointer or parameter, so the message is actionable and a retry
	// would send the same invalid body.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 405 on a route whose method the resource does not support, and 409 for a
	// create the provider refuses (a duplicate code, or a resource whose type
	// does not accept that write). Neither changes on a retry.
	CONFLICT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 405 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is Lemon Squeezy's own trouble, and only a GET is safe to replay:
	// a refund, a cancel or a checkout create must never be sent twice.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof LemonSqueezyAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. A plain spread would keep
 * the caller's value but the builtin's position, so a caller handler for a
 * status no builtin covers would never run.
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
