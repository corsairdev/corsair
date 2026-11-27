import type { CorsairErrorHandler } from 'corsair/core';
import { NtfyAPIError } from './client';

// Status codes: https://docs.ntfy.sh/publish/#limitations and the error
// envelope { code, http, error }; observed codes in the research probes:
// 40007 invalid parameter, 40101 unauthorized, 40301 forbidden, 40401
// page not found, 42905 bandwidth (docs-only).
export const errorHandlers = {
	// Both the 429 status (headers rate limit, messages/day) and the
	// bandwidth-exceeded poll (body code 42905) retry, honoring Retry-After
	// when the response carries one.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof NtfyAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof NtfyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 / 40101: a wrong or expired token. ntfy.sh validates any Bearer
	// header, even on public topics.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NtfyAPIError &&
			(error.status === 401 || error.ntfyCode === 40101),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 / 40301: a read-only or reserved topic (e.g. ntfy.sh `stats`,
	// `announcements`).
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof NtfyAPIError &&
			(error.status === 403 || error.ntfyCode === 40301),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 (40007 invalid parameter) and 404 (40401, also what an invalid
	// topic name routes to). A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NtfyAPIError &&
				(error.status === 400 ||
					error.status === 404 ||
					error.ntfyCode === 40007 ||
					error.ntfyCode === 40401)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection (reset, DNS, abort) never reached the server, so
	// replaying a read is safe. A write with a transport failure stays on
	// DEFAULT: a retried publish can duplicate a notification.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof NtfyAPIError &&
			error.method === 'GET' &&
			error.cause instanceof Error,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx is only replayed for reads. Publish, update, clear and delete are
	// not idempotent: a retry after a timeout can duplicate a notification.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NtfyAPIError &&
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
