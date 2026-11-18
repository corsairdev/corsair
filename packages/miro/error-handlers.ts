import type { CorsairErrorHandler } from 'corsair/core';
import { MiroAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof MiroAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof MiroAPIError ? error.code : undefined;
}

// Status codes: https://developers.miro.com/reference/errors
export const errorHandlers = {
	// 401 with `tokenNotProvided` or `unauthorized`: the bearer token is missing,
	// expired or revoked, so no retry can help.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			codeOf(error) === 'tokenNotProvided' ||
			codeOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token's scopes do not cover the route, or the board is not shared
	// with the user. `boards:read` and `boards:write` are the two scopes here.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown board, item, tag or member id.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: a malformed body or a bad id format. A retry sends the same thing.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: a conflict such as an existing board name or a board quota. The docs
	// say to handle it rather than retry it.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: Miro's per-minute tier limit. It sends Retry-After, and the client
	// copies it onto the error; two seconds is the fallback.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || codeOf(error) === 'rateLimitExceeded',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				(error instanceof MiroAPIError ? error.retryAfter : undefined) ?? 2_000,
		}),
	},
	// 5xx: a read is retried with backoff. A write is not: a 502 or 504 can come
	// from a gateway after Miro applied it, and a second POST would add a second
	// item, a second board copy or a second invitation email. The caller gets the
	// error and can check the board before sending it again.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: error instanceof MiroAPIError && isRead(error.method) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached the provider, so a read is replayed and
	// a write waits for the caller instead.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof MiroAPIError &&
			(error.status === 408 || error.name === 'TimeoutError'),
		handler: async (error: Error) => ({
			maxRetries: error instanceof MiroAPIError && isRead(error.method) ? 2 : 0,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof MiroAPIError &&
			error.status === undefined &&
			error.method !== undefined,
		handler: async (error: Error) => ({
			maxRetries: error instanceof MiroAPIError && isRead(error.method) ? 2 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Only a GET is safe to replay after a transport failure or a 5xx. */
function isRead(method: string | undefined): boolean {
	return method === 'GET';
}

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys come first, so a
// caller handler for a status no builtin covers is the one that runs.
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
