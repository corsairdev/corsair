import type { CorsairErrorHandler } from 'corsair/core';
import { MeloAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof MeloAPIError ? error.status : undefined;
}

// Status codes: https://docs.stream.estate/api-reference/errors.md and the
// responses of each operation in the OpenAPI spec.
export const errorHandlers = {
	// 429 "you're requesting too much". Melo documents no Retry-After header, so
	// a real one wins and otherwise the delay is 1s, 2s, 4s. A 429 is a refusal,
	// so retrying a write here cannot repeat it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof MeloAPIError ? error.isRateLimit : false,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof MeloAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong key answers the plain text "Authentication failed".
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is in the error table but on no operation; treat it as final.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no property or search has that id.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Input that failed the zod schema before any request went out.
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 "your request is incorrect". A retry sends the same request.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Melo says to try a 500 again later. Only replay-safe calls are repeated:
	// a failed create may have gone through, and webhook-tester is a GET that
	// delivers a payload, so replaying it would deliver twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof MeloAPIError &&
			error.replaySafe &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A reset, DNS failure or timeout. Same replay rule as SERVER_ERROR.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof MeloAPIError && error.transport && error.replaySafe,
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

// Handlers match in key order and DEFAULT matches everything. Caller keys go
// first so a handler for a status no builtin covers runs before DEFAULT, then
// the builtins the caller did not name, then DEFAULT last.
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
