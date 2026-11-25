import type { CorsairErrorHandler } from 'corsair/core';
import { LobAPIError } from './client';

function asLobError(error: Error): LobAPIError | undefined {
	return error instanceof LobAPIError ? error : undefined;
}

// Mail sends dispatch physical print jobs, and verification posts spend
// Lob Credits. A replay is safe only for reads, or for a send that carried an
// Idempotency-Key, which makes Lob return the original piece.
function canReplay(error: LobAPIError): boolean {
	return error.method === 'GET' || error.hasIdempotency;
}

// Codes and statuses: https://docs.lob.com (error responses section) and the
// spec's error code enum. Lob documents no Retry-After; the 429 body says to
// wait 5 seconds and the window resets on X-Rate-Limit-Reset.
export const errorHandlers = {
	// 150 requests per 5 seconds per key and endpoint (300 for the two
	// verification endpoints). Both the plain 429 and the body-coded 429
	// must match: a gateway 429 arrives without the Lob body.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof LobAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 2,
			// Lob's own 429 text asks for 5 seconds; there is no header to read.
			headersRetryAfterMs: 5_000,
		}),
	},
	// 401: missing or wrong key (`unauthorized`, `invalid_api_key`,
	// `publishable_key_not_allowed` for a test-mode web key).
	AUTH_ERROR: {
		match: (error: Error) => {
			const lob = asLobError(error);
			return (
				lob?.status === 401 ||
				lob?.code === 'unauthorized' ||
				lob?.code === 'invalid_api_key' ||
				lob?.code === 'publishable_key_not_allowed'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/404/413/422: bad input, unknown resource, oversized body. A retry
	// sends the same request and gets the same answer.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = asLobError(error)?.status;
			return (
				status === 400 || status === 404 || status === 413 || status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 outside rate limits: Lob's `conflict` code.
	CONFLICT_ERROR: {
		match: (error: Error) => asLobError(error)?.status === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 408 and `request_timeout`: Lob timed the request out. Only replays a
	// read or an idempotency-keyed send.
	TIMEOUT_ERROR: {
		match: (error: Error) => {
			const lob = asLobError(error);
			return lob?.status === 408 || lob?.code === 'request_timeout';
		},
		handler: async (error: Error) => {
			const lob = asLobError(error);
			return lob && canReplay(lob)
				? { maxRetries: 1, headersRetryAfterMs: 1_000 }
				: { maxRetries: 0 };
		},
	},
	// 500 `internal_server_error` and 503 `service_unavailable`: Lob asks for
	// a later retry. Only replays a read or an idempotency-keyed send.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = asLobError(error)?.status ?? 0;
			return status >= 500;
		},
		handler: async (error: Error) => {
			const lob = asLobError(error);
			return lob && canReplay(lob)
				? { maxRetries: 1, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
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
