import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// NetHunt has no error codes. A bad email/key pair is a 401 with a plain-text
// body, a missing folder or record a 404 with an empty one, and a malformed body
// a 400. Nothing here writes twice on a retry.
export const errorHandlers = {
	// Core's request() already retried the 429 three times, so it is not
	// replayed again here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 is a bad email or key. Retrying cannot fix either.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a malformed field map or action, and 404 a folder or record that
	// does not exist. Both need the caller to change something.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx on a read is safe to replay. A create, update or delete is not:
	// NetHunt has no idempotency key, so a retried write can double up.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
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
