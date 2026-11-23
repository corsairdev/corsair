import type { CorsairErrorHandler } from 'corsair/core';
import { MoneybirdAPIError } from './client';

function asMoneybirdError(error: Error): MoneybirdAPIError | undefined {
	return error instanceof MoneybirdAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMoneybirdError(error)?.status;
}

/**
 * Status codes: https://developer.moneybird.com (Responses table) and the
 * Throttling section (429 with Retry-After, 150 requests per 5 minutes per
 * IP).
 */
export const errorHandlers = {
	// 429 is the documented throttle; Retry-After is documented for it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMoneybirdError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: an invalid or revoked token.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the account plan limit is reached, no retry can clear it.
	// 403: the IP is blacklisted for API usage.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed parameters, 404 unknown entity, 406 unsupported content
	// type, 422 validation. The same request fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 406 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads are replayed; Moneybird documents no idempotency keys.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMoneybirdError(error)?.replayable === true &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Moneybird, so a
	// read can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMoneybirdError(error)?.replayable === true &&
			asMoneybirdError(error)?.status === undefined,
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
