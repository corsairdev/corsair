import type { CorsairErrorHandler } from 'corsair/core';
import { PandadocAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PandadocAPIError ? error.status : undefined;
}

// The client retries a 429 up to three times through core, honouring
// Retry-After. No RATE_LIMIT_ERROR handler is needed here: DEFAULT adds no
// retries after the client has used its attempts.
// Documented statuses per reference page: 400 validation, 401 authentication,
// 403 permission, 404 unknown resource, 409 conflict, 423 locked (a document
// another process holds), 429 rate limit.
// https://developers.pandadoc.com/reference/about
export const errorHandlers = {
	// 401: a missing or wrong API key ("Authentication credentials were not
	// provided." verified live without a key).
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 403 permission denied, 404 unknown resource, 409
	// state conflict, 423 document locked. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 403 ||
				status === 404 ||
				status === 409 ||
				status === 423
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: a send or delete retried after a 500 would run
	// twice, and PandaDoc documents no idempotency keys.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PandadocAPIError &&
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
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
