import type { CorsairErrorHandler } from 'corsair/core';
import { ShotstackAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ShotstackAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof ShotstackAPIError ? error.code : undefined;
}

/** Replays are safe only for GETs and for generate creates sent with an Idempotency-Key. */
function replaySafe(error: Error): boolean {
	return (
		error instanceof ShotstackAPIError &&
		(error.method === 'GET' || error.hasIdempotency)
	);
}

/**
 * Statuses and bodies: all services answer json:api `{ errors: [...] }` on
 * auth and rate limits; the Edit API also answers an envelope with
 * `success: false`; generate answers bare `{ error, code }`. Sources:
 * shotstack.io/docs/guide (limitations), the three OpenAPI specs, and the
 * probe evidence in the research notes.
 */
export const errorHandlers = {
	// A 429 that names the generation quota is the account running out of
	// credits, which no retry can fix; it must be matched before the rate
	// limit below, which also matches plain 429s.
	QUOTA_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 && error.message.includes('quota'),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 on a fixed 60-second window per key, and the body code
	// `rate_limit_error` when a gateway answers 429 without Shotstack's body.
	// No Retry-After is documented; a real header overrides the fallback.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || codeOf(error) === 'rate_limit_error',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ShotstackAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 402: the account has too few generation credits for this asset.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: missing, wrong or disabled key, or a sandbox key sent to v1.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: plan gating on generate (AiCapabilityNotIncluded and friends) or an
	// invalid key. Changing the request cannot fix either mid-call.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: an Idempotency-Key reused for a different asset inside 24 hours.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad input and 404 unknown id. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Shotstack's own 5xx. Replays are gated on idempotency, not on the method
	// heuristic alone.
	SERVER_ERROR: {
		match: (error: Error) => replaySafe(error) && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The request never reached Shotstack, so replaying cannot repeat a write
	// that went through; still gated on idempotency for the writes.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof ShotstackAPIError &&
			error.transport &&
			replaySafe(error),
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
