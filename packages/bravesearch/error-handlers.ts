import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { braveErrorCode } from './client';

// Brave errors: {"type":"ErrorResponse","error":{"status","code","detail","meta"}}.
// Seen live: 400 OPTION_NOT_IN_PLAN (endpoint not in the key's plan), 401
// ADMIN_KEY_INVALID; documented: 403 ADMIN_KEY_SCOPE_MISSING, 422 VALIDATION,
// 429 RATE_LIMITED / ADMIN_RATE_LIMITED, 503 ADMIN_OVERLOADED. Failed calls
// are not billed (Brave's rate-limiting guide).

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * A 429 is the per-second limit unless Brave says otherwise. A spent monthly
 * quota or usage limit (any code mentioning QUOTA or LIMIT_EXCEEDED, or a
 * quota meta at its cap) won't clear by retrying, so it isn't retried.
 */
export function isSpentQuota(error: Error): boolean {
	const code = braveErrorCode(error) ?? '';
	if (/QUOTA|LIMIT_EXCEEDED|USAGE_LIMIT/i.test(code)) return true;
	const meta = (error as ApiError).body?.error?.meta as
		| { quota_limit?: unknown; quota_current?: unknown }
		| undefined;
	return (
		typeof meta?.quota_limit === 'number' &&
		meta.quota_limit > 0 &&
		typeof meta.quota_current === 'number' &&
		meta.quota_current >= meta.quota_limit
	);
}

export const errorHandlers = {
	// Checked before the rate-limit retry: a spent quota also answers 429.
	QUOTA_EXCEEDED_ERROR: {
		match: (error: Error) => status(error) === 429 && isSpentQuota(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		// The transport's own 429 retries are off (client.ts), so this is the
		// only retry. Brave refused the call before running it, so a retry is
		// safe for every operation; its window is one second.
		match: (error: Error) => status(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? (error.retryAfter ?? 1000) : 1000,
		}),
	},
	SERVICE_UNAVAILABLE_ERROR: {
		// 503 (ADMIN_OVERLOADED and the like) comes with Retry-After.
		match: (error: Error) => status(error) === 503,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? (error.retryAfter ?? 2000) : 2000,
		}),
	},
	PLAN_ERROR: {
		match: (error: Error) => braveErrorCode(error) === 'OPTION_NOT_IN_PLAN',
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const s = status(error);
			return s === 401 || s === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const s = status(error);
			return s === 400 || s === 404 || s === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
