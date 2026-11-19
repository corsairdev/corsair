import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleAdsTransportError, isReadRequest } from './client';

function apiError(error: Error): ApiError | undefined {
	return error instanceof ApiError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return apiError(error)?.status;
}

/** Whether the failed request only read, so replaying it cannot apply a change twice. */
function failedRead(error: Error): boolean {
	const request = apiError(error)?.request;
	return request ? isReadRequest(request.method, request.url) : false;
}

/**
 * QuotaError codes that a retry within seconds cannot clear. `RESOURCE_EXHAUSTED`
 * is the daily operations quota (the per-second limits answer
 * `RESOURCE_TEMPORARILY_EXHAUSTED`), the long-term query cap lasts for hours,
 * and the other two need a person to act.
 * https://developers.google.com/google-ads/api/reference/rpc/v26/QuotaErrorEnum.QuotaError
 */
const NON_RETRYABLE_QUOTA_ERRORS = new Set([
	'RESOURCE_EXHAUSTED',
	'EXCESSIVE_LONG_TERM_QUERY_RESOURCE_CONSUMPTION',
	'ACCESS_PROHIBITED',
	'PAYMENTS_PROFILE_ACTIVATION_RATE_LIMIT_EXCEEDED',
]);

/** A wait longer than this means the quota resets later than a retry loop should hold a call. */
const MAX_RETRY_DELAY_MS = 60_000;

type QuotaDetails = { codes: string[]; retryDelayMs?: number };

/**
 * Reads the QuotaError codes and the `quotaErrorDetails.retryDelay` (a protobuf
 * Duration such as `"30s"`) from the GoogleAdsFailure detail of a 429 body.
 * Only codes and the delay are read; messages and triggers stay on the body.
 */
function quotaDetails(error: ApiError): QuotaDetails {
	const codes: string[] = [];
	let retryDelayMs: number | undefined;
	// unknown: ApiError.body is the provider's JSON, narrowed step by step below.
	const details: unknown = error.body?.error?.details;
	if (!Array.isArray(details)) return { codes };
	for (const detail of details) {
		// unknown: one google.rpc.Status detail; only GoogleAdsFailure has `errors`.
		const failures: unknown = detail?.errors;
		if (!Array.isArray(failures)) continue;
		for (const failure of failures) {
			const code = failure?.errorCode?.quotaError;
			if (typeof code === 'string') codes.push(code);
			const delay = failure?.details?.quotaErrorDetails?.retryDelay;
			const match =
				typeof delay === 'string' ? /^(\d+(?:\.\d+)?)s$/.exec(delay) : null;
			if (match?.[1]) {
				const ms = Math.ceil(Number(match[1]) * 1000);
				retryDelayMs = Math.max(retryDelayMs ?? 0, ms);
			}
		}
	}
	return { codes, retryDelayMs };
}

/**
 * The Google Ads error model, from
 * https://developers.google.com/google-ads/api/docs/best-practices/understand-api-errors:
 *
 * - `429` is `RESOURCE_EXHAUSTED`: a quota or an overloaded system. The
 *   QuotaError code in the GoogleAdsFailure detail says which quota; Google
 *   asks for exponential backoff with jitter, and sends no Retry-After header.
 * - `503` is `UNAVAILABLE`, documented as a transient condition that is highly
 *   recommended to retry. `504` is `DEADLINE_EXCEEDED`, also described as
 *   transient.
 * - `409` is `ALREADY_EXISTS`, and `ABORTED` (a transaction conflict) also maps
 *   to 409. The docs say ABORTED is often safe to retry, so a 409 is left
 *   alone here: a retry that recreates a campaign is worse than a failed call.
 * - `500`/`UNKNOWN`, `INTERNAL` and `DATA_LOSS` share the 500 status. The docs
 *   call the first two worth retrying and DATA_LOSS not, and the status alone
 *   cannot tell them apart, so a 500 is replayed for reads only.
 * - `401` is `UNAUTHENTICATED`. Core refreshes once and retries.
 * - `403` is `PERMISSION_DENIED`: the token lacks access to that account. No
 *   retry grants permission.
 *
 * Every write is a POST, and a search is a POST that is safe to repeat, so the
 * request path decides a replay (isReadRequest), not the HTTP method.
 */
export const errorHandlers = {
	// 429 is RESOURCE_EXHAUSTED for every quota, so the GoogleAdsFailure detail
	// decides: the per-second limits are retried with backoff, the daily quota
	// is not, because nothing changes until it resets. The plugin owns these
	// retries (client.ts turns core's off), so a wait Google names is forwarded.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			const failed = apiError(error);
			if (!failed) return { maxRetries: 0 };
			const { codes, retryDelayMs } = quotaDetails(failed);
			const waitMs = retryDelayMs ?? failed.retryAfter;
			if (
				codes.some((code) => NON_RETRYABLE_QUOTA_ERRORS.has(code)) ||
				(waitMs !== undefined && waitMs > MAX_RETRY_DELAY_MS)
			) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff_jitter' as const,
				...(waitMs ? { headersRetryAfterMs: waitMs } : {}),
			};
		},
	},

	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 400 INVALID_ARGUMENT, FAILED_PRECONDITION and OUT_OF_RANGE, and 409
	// ALREADY_EXISTS or ABORTED. The request or the account state has to change
	// before a retry could work.
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

	// 504 DEADLINE_EXCEEDED, and 503 UNAVAILABLE. Both are documented as
	// transient. A write is still not replayed: a mutate has no idempotency key,
	// so a retry could create the entity twice.
	UPSTREAM_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 503 || status === 504;
		},
		handler: async (error: Error) => ({
			maxRetries: failedRead(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// 500 covers UNKNOWN, INTERNAL and DATA_LOSS, and only the first two are worth
	// a retry. Reads only: a mutate may have been applied.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: failedRead(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// A dropped connection never reached Google. A read is safe to repeat; a
	// mutate is not, because the connection can drop after it was applied.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GoogleAdsTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof GoogleAdsTransportError && error.isRead ? 1 : 0,
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
