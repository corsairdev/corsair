import type { CorsairErrorHandler } from 'corsair/core';
import { LoopsAPIError } from './client';

function asLoopsError(error: Error): LoopsAPIError | undefined {
	return error instanceof LoopsAPIError ? error : undefined;
}

/**
 * Loops status map: 429 rate limit, 401 bad key or disabled feature flag,
 * 409 duplicate contact or reused idempotency key, 400/404 validation and
 * not-found, 405 wrong method. No documented Retry-After, so rate-limit
 * retries run the exponential strategy (1s/2s/4s).
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => asLoopsError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asLoopsError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The account works but the team has not turned the feature on (content
	// API, workflow API). Retrying cannot change that, and the caller needs the
	// message, not a generic auth failure.
	FEATURE_NOT_ENABLED: {
		match: (error: Error) => asLoopsError(error)?.featureNotEnabled === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => asLoopsError(error)?.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 on contacts/create means the email or userId already exists, and on
	// transactional.send a reused Idempotency-Key. The request has to change.
	CONFLICT_ERROR: {
		match: (error: Error) => asLoopsError(error)?.status === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 not-found, 405 wrong method, and the
	// success:false envelope that arrived inside a 2xx.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const loops = asLoopsError(error);
			return (
				error.name === 'ZodError' ||
				loops?.envelopeFailure === true ||
				loops?.status === 400 ||
				loops?.status === 404 ||
				loops?.status === 405
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have been applied before the failure, so only replay reads and
	// requests that carry an Idempotency-Key.
	SERVER_ERROR: {
		match: (error: Error) =>
			(asLoopsError(error)?.status ?? 0) >= 500 &&
			asLoopsError(error)!.canReplay,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The request never reached Loops, so a read or a keyed send can go again.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asLoopsError(error)?.transport === true && asLoopsError(error)!.canReplay,
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
// last even when the caller adds or overrides handlers. Caller keys go first:
// core runs the first handler whose match passes, so a builtin key placed
// ahead of a caller key would claim the error before the caller's handler
// could run at all.
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
