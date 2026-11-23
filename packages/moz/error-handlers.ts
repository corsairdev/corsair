import type { CorsairErrorHandler } from 'corsair/core';
import { MozAPIError } from './client';

function asMozError(error: Error): MozAPIError | undefined {
	return error instanceof MozAPIError ? error : undefined;
}

/**
 * Caller keys first, then any builtin the caller did not name, then DEFAULT
 * last: core runs the first handler whose match passes, in key order, so a
 * plain spread would leave a caller handler shadowed by a builtin.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: userDefault, ...userRest } = user ?? {};
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}

function codeOf(error: Error): number | undefined {
	return asMozError(error)?.code;
}

function statusOf(error: Error): number | undefined {
	return asMozError(error)?.status;
}

/**
 * Error codes and their retry contract come from the error handling guide
 * (https://moz.com/api/docs/guides/error-handling). Handlers branch on the
 * JSON-RPC `code` first (stable across message wording) and the HTTP status
 * second, because the edge layer answers with different shapes than the
 * method layer.
 */
export const errorHandlers = {
	// 401: the token is missing, malformed or no longer valid. The docs are
	// explicit that retrying will not help until the token is corrected, and
	// that ten auth failures in five minutes trigger a 30-minute block.
	AUTH_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32651 || statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 with -32670 means the account is out of quota, which no retry can
	// fix. 403 has no other documented meaning on this API, so quota owns it.
	QUOTA_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32670 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/404/413/415: invalid params (-32652), unknown method (-32601),
	// malformed or oversize request (-32600), unparseable body (-32700),
	// not found (-32655), or a method that could not be completed (-32653).
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			const status = statusOf(error);
			return (
				(code !== undefined &&
					[-32652, -32601, -32600, -32700, -32653, -32655].includes(code)) ||
				(status !== undefined && [400, 404, 413, 415].includes(status))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 comes in two kinds. A per-method limit (-32658) carries Retry-After
	// and honours a real header; an edge limit (-32650) carries no header and
	// "clears by itself as your error rate falls", so exponential backoff
	// carries the wait. No window is documented for the edge limits.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32658 ||
			codeOf(error) === -32650 ||
			statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMozError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 500 (-32603/-32602): "the same request may well succeed on a retry".
	// Only reads replay; the start of the competitor job spends quota, so a
	// lost response after acceptance must not be sent twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			(asMozError(error)?.replayable ?? false) &&
			(codeOf(error) === -32603 ||
				codeOf(error) === -32602 ||
				(statusOf(error) !== undefined && statusOf(error)! >= 500)),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A network drop never reached Moz, so a read can replay it. Writes and
	// the job-starting competitor fetch set replayable: false and fall here
	// without retries.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === undefined && codeOf(error) === undefined,
		handler: async (error: Error) =>
			asMozError(error)?.replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// DEFAULT matches everything; mergeErrorHandlers keeps it last.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
