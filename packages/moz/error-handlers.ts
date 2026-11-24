import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { mozErrorCode } from './client';

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
	return error instanceof ApiError ? mozErrorCode(error.body) : undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Error codes per https://moz.com/api/docs/guides/error-handling. Handlers
 * branch on the JSON-RPC `code` first and the HTTP status second. Core's
 * request() already retries an HTTP 429 three times (honouring
 * Retry-After), so nothing here retries again.
 */
export const errorHandlers = {
	// 401 / -32651: bad token. Ten auth failures in five minutes trigger a
	// 30-minute block, so never retry.
	AUTH_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32651 || statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 / -32670: out of quota; no retry can fix it.
	QUOTA_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32670 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Invalid params (-32652), unknown method (-32601), malformed request
	// (-32600), unparseable body (-32700), could not complete (-32653), not
	// found (-32655), and the matching 400/404/413/415 statuses.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(code !== undefined &&
					[-32652, -32601, -32600, -32700, -32653, -32655].includes(code)) ||
				(status !== undefined && [400, 404, 413, 415].includes(status))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// -32658 (per-method, Retry-After) and -32650 (edge) rate limits.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			codeOf(error) === -32658 ||
			codeOf(error) === -32650 ||
			statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// DEFAULT matches everything; mergeErrorHandlers keeps it last.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
