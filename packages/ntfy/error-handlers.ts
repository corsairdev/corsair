import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ntfyErrorCode } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

const BURST_LIMIT_CODES = new Set([42901, 42906, 42911]);

/** A 429 that clears within seconds, as opposed to a spent daily quota. */
export function isNtfyBurstLimit(error: Error): boolean {
	if (statusOf(error) !== 429) return false;
	const code = ntfyErrorCode(error);
	return code === undefined || BURST_LIMIT_CODES.has(code);
}

function isRead(error: Error): boolean {
	return error instanceof ApiError && error.request.method === 'GET';
}

// Status codes: https://docs.ntfy.sh/publish/#limitations and the error
// envelope { code, http, error, link }, read from core's ApiError body:
// 40007 invalid parameter, 40101 unauthorized, 40301 forbidden, 40401
// page not found, 42901-42910 rate limits (42905 = attachment bandwidth).
export const errorHandlers = {
	// The client makes one attempt (rate limit config maxRetries 0), so this
	// handler owns 429 retries. A burst limit (42901 requests, 42906 account
	// actions, 42911 new topics, or a 429 without a code) clears within
	// seconds and is retried, honouring Retry-After; the server refused the
	// request before running it, so a write is safe to resend. A daily quota
	// (messages 42908, emails 42902, calls 42910, bandwidth 42905, ...) is
	// spent until the reset, so it is never retried (R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) =>
			isNtfyBurstLimit(error)
				? {
						maxRetries: 2,
						headersRetryAfterMs:
							error instanceof ApiError ? error.retryAfter : undefined,
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 },
	},
	// 401 / 40101: a wrong or expired token. ntfy.sh validates any
	// Authorization header, even on public topics.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || ntfyErrorCode(error) === 40101,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 / 40301: a read-only or reserved topic, or an admin-only route.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || ntfyErrorCode(error) === 40301,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 (40007 invalid parameter), 404 (40401, also what an invalid
	// topic name routes to) and 409 (user or tier exists). A retry sends the
	// same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 404 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is only replayed for reads. Publish, update, clear, delete and
	// the account writes are not idempotent: a retry after a timeout can
	// duplicate a notification.
	SERVER_ERROR: {
		match: (error: Error) => isRead(error) && (statusOf(error) ?? 0) >= 500,
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
// last even when the caller adds or overrides handlers. Caller keys keep
// their positions first: core takes the first matching key, so a caller
// handler for a status no builtin covers would never run if builtin keys
// came first.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	return fallback ? { ...merged, DEFAULT: fallback } : merged;
}
