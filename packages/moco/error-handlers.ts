import type { CorsairErrorHandler } from 'corsair/core';
import { MocoAPIError } from './client';

function asMocoError(error: Error): MocoAPIError | undefined {
	return error instanceof MocoAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMocoError(error)?.status;
}

/**
 * Status codes: https://docs.mocoapp.com/api/docs/v1 (General > Errors and
 * HTTP Status Codes) and General > Rate Limiting (429).
 */
export const errorHandlers = {
	// 120 requests per 2 minutes; Moco answers 429. No documented Retry-After
	// header, so exponential backoff carries the wait.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMocoError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong key or an unknown subdomain, which Moco answers with the
	// same body. 403: the key lacks the permission.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 validation (the body carries field errors) and 404 unknown id. The
	// same request fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 422 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads are replayed; Moco documents no idempotency keys for
	// writes.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMocoError(error)?.replayable === true && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Moco, so a read
	// can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMocoError(error)?.replayable === true &&
			asMocoError(error)?.status === undefined,
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
