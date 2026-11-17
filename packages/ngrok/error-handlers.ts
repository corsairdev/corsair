import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ngrokErrorCode, ngrokErrorMethod } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Every ngrok error carries a globally unique code. The 403 split matters most:
// 200 is a missing Authorization header and 202 a credential ngrok did not
// recognise, both of which read as the same status but mean different fixes.
// 201 is a key that is well formed but revoked or expired.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 201: revoked or expired. Checked before AUTH_ERROR, which would also match
	// its 401, because core takes the first handler whose match passes.
	REVOKED_KEY_ERROR: {
		match: (error: Error) => ngrokErrorCode(error) === 'ERR_NGROK_201',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 200 or 202: no usable key was sent. Retrying sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = ngrokErrorCode(error);
			return (
				statusOf(error) === 401 ||
				code === 'ERR_NGROK_200' ||
				code === 'ERR_NGROK_202'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 is a body ngrok refused and a 404 a missing resource; both need the
	// caller to change something. A 409 is a domain already reserved.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return [400, 404, 409, 422].includes(statusOf(error) ?? 0);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is on ngrok's side. Only a GET is replayed: a create, update or
	// delete may have gone through, and its code would have to be checked.
	SERVER_ERROR: {
		match: (error: Error) =>
			ngrokErrorMethod(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
