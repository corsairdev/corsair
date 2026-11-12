import type { CorsairErrorHandler } from 'corsair/core';
import { KommoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof KommoAPIError ? error.status : undefined;
}

// Kommo documents 400, 401, 402, 403, 404 and 429, and answers failures as
// `application/problem+json`. Reference: https://developers.kommo.com/docs/http-codes
export const errorHandlers = {
	// Two requests a second with a burst of seven. Kommo sends Retry-After, so
	// the handler waits that when it arrives and backs off otherwise.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof KommoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof KommoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is an expired or revoked token, which a retry cannot fix.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402 is a paid-feature block: the account's plan does not include this
	// entity. No retry helps.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a user whose rights do not cover this entity.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 are a payload Kommo refused, usually a custom field it does
	// not accept, and 404 an unknown entity.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay. A write is not: a 5xx after a lead create can
	// arrive once the lead exists, and a retry would create a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof KommoAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Kommo. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KommoAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KommoAPIError && error.method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof KommoAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KommoAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
