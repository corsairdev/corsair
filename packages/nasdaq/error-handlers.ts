import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Nasdaq answers a bad key with a 400 QEAx01 body, not a 401, and its gateway
 * answers a blocked route with a 403 HTML page. Both arrive as core's
 * `ApiError`, so the handlers classify on its status and the `quandl_error.code`
 * the client left in the sanitized body.
 */
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// unknown: the sanitized body is the provider's envelope; read field by field.
function codeOf(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body as { quandl_error?: { code?: unknown } } | undefined;
	const code = body?.quandl_error?.code;
	return typeof code === 'string' ? code : undefined;
}

/** A 403 with no `quandl_error` came from the gateway, not the API. */
function isBlocked(error: Error): boolean {
	return statusOf(error) === 403 && codeOf(error) === undefined;
}

const QEAx07_WAIT_MS = 30_000;

export const errorHandlers = {
	// QEAx07 asks for a 30-second wait, so the retry uses that window rather
	// than a short backoff that would burn both attempts inside it. QEAx06 is
	// the daily cap and QELx06 a temporary account block, which no retry clears.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			return statusOf(error) === 429 || code === 'QEAx06' || code === 'QEAx07';
		},
		handler: async (error: Error) => {
			const code = codeOf(error);
			// A 429 with no Nasdaq code came from a proxy or gateway, so it is a
			// short throttle rather than a quota; the transport does not retry
			// (client.ts), so this does, honouring Retry-After when one is sent.
			if (code === undefined && statusOf(error) === 429) {
				return {
					maxRetries: 2,
					headersRetryAfterMs:
						error instanceof ApiError ? error.retryAfter : undefined,
					retryStrategy: 'exponential_backoff' as const,
				};
			}
			if (code !== 'QEAx07') return { maxRetries: 0 };
			return {
				maxRetries: 2,
				// A real Retry-After still wins over this fallback.
				headersRetryAfterMs: QEAx07_WAIT_MS,
				retryStrategy: 'linear_4s' as const,
			};
		},
	},
	// QEAx01 is an unknown key and QEPx04 a missing one. Neither retries.
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			return code === 'QEAx01' || code === 'QEPx04' || statusOf(error) === 401;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The gateway answered 403 with no JSON at all. Retrying the same way gets
	// the same block, so this is reported rather than retried. It sits before
	// VALIDATION_ERROR, whose 403 branch would otherwise catch it first.
	BLOCKED_ERROR: {
		match: (error: Error) => isBlocked(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// QESx06 is an expired cursor, which needs a fresh first page rather than a
	// repeat. A 404 route and a 400 filter both need the caller to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every wrapped route is a GET, so a 5xx can be replayed safely.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys go first, then any builtin they did not name, then one DEFAULT.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
