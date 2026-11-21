import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	GoogleAdminTransportError,
	isExhaustedQuota,
	isRateLimitReason,
	readFailureReason,
} from './client';

function apiError(error: Error): ApiError | undefined {
	return error instanceof ApiError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return apiError(error)?.status;
}

/**
 * Google's failure taxonomy for this API:
 * https://developers.google.com/workspace/admin/directory/v1/limits documents
 * the quota failures, and each method's reference page lists its statuses.
 *
 * - `429` and `403 userRateLimitExceeded` / `quotaExceeded` are throughput
 *   limits. Google's guide asks for exponential backoff, and sends no
 *   Retry-After, so the delay comes from the retry strategy.
 * - `403 dailyLimitExceeded` / `limitExceeded`, and a 403 or 429 whose message
 *   names a "per day" quota, are exhausted quotas for the day. Retrying cannot
 *   fix them, so they are reported immediately.
 * - `401` is an expired or revoked token. Core refreshes once and retries, so
 *   nothing more belongs here.
 * - `409` on users.insert is a duplicate or an unresolved conflicting account;
 *   on members.insert a cycle. Neither changes on a retry.
 * - `5xx` is replayed for reads only: a write may already have landed, and a
 *   retried users.insert would create a second account.
 */
export const errorHandlers = {
	// A 403 or 429 that names a quota spent for the day. Checked first so it is
	// never retried: waiting out a backoff cannot refill a daily quota.
	QUOTA_ERROR: {
		match: (error: Error) => isExhaustedQuota(error),
		handler: async () => ({ maxRetries: 0 }),
	},

	// 429, and the 403 reasons Google documents as "retry with backoff". The
	// client turns core's own 429 retries off, so these retries are the only
	// ones. Google sends no Retry-After today; if it starts to, the delay it
	// asks for is used instead of the backoff.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 429) return true;
			if (status !== 403) return false;
			return isRateLimitReason(readFailureReason(error));
		},
		handler: async (error: Error) => {
			const retryAfter = apiError(error)?.retryAfter;
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				...(retryAfter && retryAfter > 0
					? { headersRetryAfterMs: retryAfter }
					: {}),
			};
		},
	},

	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 403 without a quota reason: the caller is not a super administrator,
	// lacks the scope for this resource, or the reseller/domain setting forbids
	// it. Retrying cannot grant the permission.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 400 malformed or refused input, 409 duplicate or membership cycle, 412 a
	// failed precondition. Google documents that a user that was just created
	// can answer 409 until propagation finishes, so a caller can retry that one
	// deliberately; it is not retried here.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 412
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},

	// A dropped connection never reached Google, so repeating a read is safe. A
	// write is left alone: a reset can arrive after the request was applied.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GoogleAdminTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof GoogleAdminTransportError && error.method === 'GET'
					? 2
					: 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// Replayed for reads only: a write may have landed before the failure.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: apiError(error)?.request.method === 'GET' ? 2 : 0,
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
	// A caller handler named DEFAULT becomes the fallback in DEFAULT's position,
	// whatever order the caller wrote its keys in.
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
