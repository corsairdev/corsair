import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { LobRequestInfo } from './client';
import { lobErrorCode, lobRequestInfo } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Mail sends dispatch physical print jobs and verifications spend credits. A
// replay is safe only for reads, or for a send that carried an
// Idempotency-Key, which makes Lob return the original piece.
function canReplay(info: LobRequestInfo | undefined): boolean {
	return info !== undefined && (info.method === 'GET' || info.hasIdempotency);
}

// Codes and statuses: https://docs.lob.com (error responses section) and the
// spec's error code enum. The client throws core's ApiError (request body
// stripped); a transport failure passes through as fetch threw it.
export const errorHandlers = {
	// Core's request() already retried a 429 three times (1 s, 2 s, 4 s),
	// which spans Lob's 5-second window (150 requests per 5 seconds per key
	// and endpoint). PLUGIN_PR_RULES R8: the handler does not retry again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || lobErrorCode(error) === 'rate_limit_exceeded',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: missing or wrong key (`unauthorized`, `invalid_api_key`,
	// `publishable_key_not_allowed` for a test-mode web key). 403: the key
	// lacks access to a feature (Campaigns, Informed Delivery, uploads).
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = lobErrorCode(error);
			return (
				status === 401 ||
				status === 403 ||
				code === 'unauthorized' ||
				code === 'invalid_api_key' ||
				code === 'publishable_key_not_allowed'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/404/413/422: bad input, unknown resource, oversized body. A retry
	// sends the same request and gets the same answer.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return (
				status === 400 || status === 404 || status === 413 || status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 outside rate limits: Lob's `conflict` code.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 408 and `request_timeout`: Lob timed the request out. Only replays a
	// read or an idempotency-keyed send.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 || lobErrorCode(error) === 'request_timeout',
		handler: async (error: Error) =>
			canReplay(lobRequestInfo(error))
				? { maxRetries: 1, headersRetryAfterMs: 1_000 }
				: { maxRetries: 0 },
	},
	// 500 `internal_server_error` and 503 `service_unavailable`: Lob asks for
	// a later retry. Only replays a read or an idempotency-keyed send.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) =>
			canReplay(lobRequestInfo(error))
				? { maxRetries: 1, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// A dropped connection, reset, DNS failure or timeout: no HTTP answer, so
	// nothing above matches. A read can be sent again as is; a send cannot,
	// because Lob may have applied it before the connection dropped.
	TRANSPORT_ERROR: {
		match: (error: Error) => lobRequestInfo(error)?.transportFailure === true,
		handler: async (error: Error) =>
			canReplay(lobRequestInfo(error))
				? { maxRetries: 1, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
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
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	// Caller keys first, then builtins the caller did not name: core takes the
	// first match in key order, so a plain spread would resolve a caller
	// handler whose key a builtin does not share to the builtin that runs
	// earlier and matches the same error.
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
