import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GooglePhotosTransportError } from './client';

function apiError(error: Error): ApiError | undefined {
	return error instanceof ApiError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return apiError(error)?.status;
}

/** The guide's minimum wait after a 429, which a shorter Retry-After does not lower. */
export const RATE_LIMIT_FLOOR_MS = 30_000;

const PER_DAY_OR_MONTH = /per\s*day|daily|per\s*month|monthly/i;

/**
 * True when a 429 reports a spent daily or monthly quota, which no retry within
 * the call can clear. Google names the quota in the structured details of its
 * error envelope (https://cloud.google.com/apis/design/errors): an ErrorInfo
 * entry carries `metadata.quota_limit` (e.g. `ApiCallsPerDayPerProject`), a
 * QuotaFailure entry carries `violations[].quotaId`, and older envelopes carry
 * `errors[].reason` `dailyLimitExceeded`. The message text is not read.
 */
export function isQuotaExhausted(error: Error): boolean {
	const api = apiError(error);
	if (api?.status !== 429) return false;
	// unknown: the error body is untyped until its members are checked.
	const body: unknown = api.body;
	if (body === null || typeof body !== 'object') return false;
	// unknown: envelope member, checked below.
	const envelope = (body as { error?: unknown }).error;
	if (envelope === null || typeof envelope !== 'object') return false;
	const { details, errors } = envelope as {
		details?: unknown; // unknown: an array of typed detail objects.
		errors?: unknown; // unknown: the legacy per-error list.
	};

	const names: string[] = [];
	for (const entry of Array.isArray(details) ? details : []) {
		if (entry === null || typeof entry !== 'object') continue;
		const detail = entry as {
			metadata?: { quota_limit?: unknown; quota_metric?: unknown }; // unknown: string per Google, checked below.
			violations?: Array<{ quotaId?: unknown }>; // unknown: string per Google, checked below.
		};
		names.push(String(detail.metadata?.quota_limit ?? ''));
		for (const violation of Array.isArray(detail.violations)
			? detail.violations
			: []) {
			names.push(String(violation?.quotaId ?? ''));
		}
	}
	for (const entry of Array.isArray(errors) ? errors : []) {
		// unknown: legacy entries carry a string reason, checked by String().
		const reason = String((entry as { reason?: unknown })?.reason ?? '');
		if (/^dailyLimitExceeded$/i.test(reason)) return true;
	}
	return names.some((name) => PER_DAY_OR_MONTH.test(name));
}

/**
 * Codes: https://developers.google.com/photos/library/guides/api-limits-quotas
 * (a 429 is either the 10,000-request daily project quota or a per-user rate
 * limit) and the upload guide's best practices (a 429 needs at least a 30
 * second delay; a 500 usually means parallel writes for one user).
 *
 * A 429 is retried here because client.ts turns core's own 429 retries off
 * (one place owns retries). The guide's 30 second floor is longer than any
 * strategy core offers, so it is passed as the wait: a longer Retry-After
 * wins, a shorter one is raised to 30s. A 429 for a spent daily quota (the
 * Library API's 10,000 requests per project per day) is not retried at all.
 *
 * A write is never replayed after a 5xx or a dropped connection: an upload can
 * have landed, and batchCreate has no idempotency key.
 */
export const errorHandlers = {
	// Ordered before RATE_LIMIT_ERROR: core takes the first key that matches.
	QUOTA_EXHAUSTED_ERROR: {
		match: (error: Error) => isQuotaExhausted(error),
		handler: async () => ({ maxRetries: 0 }),
	},

	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: Math.max(
				apiError(error)?.retryAfter ?? 0,
				RATE_LIMIT_FLOOR_MS,
			),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 403 is a missing scope or no access to that album or item. The March 2025
	// change means a read can fail this way even with valid credentials.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 400 INVALID_ARGUMENT is a malformed request or a filter sent with an
	// albumId; 409 is a conflict, which a retry repeats.
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

	// 5xx, including the 500 the upload guide attributes to parallel writes.
	// Reads only.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: apiError(error)?.request.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// A dropped connection never reached Google. Reads only: an upload can have
	// been received, and its token would be lost.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GooglePhotosTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof GooglePhotosTransportError && error.isRead ? 2 : 0,
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
