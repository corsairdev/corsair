import type { CorsairErrorHandler } from 'corsair/core';
import { NgrokAPIError } from './client';

// Every ngrok error carries a globally unique code. The 403 split matters most:
// 200 is a missing Authorization header and 202 a credential ngrok did not
// recognise, both of which read as the same status but mean different fixes.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NgrokAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 200 or 202: no usable key was sent. Retrying sends the same key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NgrokAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 201: the key is well formed but revoked or expired.
	REVOKED_KEY_ERROR: {
		match: (error: Error) =>
			error instanceof NgrokAPIError && error.isRevokedKey,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 is a body ngrok refused and a 404 a missing resource; both need the
	// caller to change something. A 409 is a domain already reserved.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NgrokAPIError &&
				[400, 404, 409, 422].includes(error.status ?? 0)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is on ngrok's side. Only a GET is replayed: a create, update or
	// delete may have gone through, and its code would have to be checked.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NgrokAPIError &&
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
