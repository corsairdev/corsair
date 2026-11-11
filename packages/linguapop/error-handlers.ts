import type { CorsairErrorHandler } from 'corsair/core';
import { LinguapopAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof LinguapopAPIError ? error.status : undefined;
}

// A read can be replayed after any failure. sendInvitation cannot: Linguapop
// documents no idempotency for it (externalIdentifier is "an ID to identify
// your candidate", not a duplicate guard), and a lost response may hide an
// invitation that was created, emailed and will be billed when completed.
function isReplaySafe(error: Error): boolean {
	return error instanceof LinguapopAPIError && error.method === 'GET';
}

// Linguapop publishes no error table. The statuses below are the ones seen on
// live probes (400 text for an unrecognised key, 400 problem+json for validation,
// 405 for the wrong method, 200 text/html for a missing route) plus the
// standard HTTP meanings for the rest.
export const errorHandlers = {
	// Documented nowhere; matched on the standard 429 so a throttle is retried
	// instead of failing. The request was refused, so a write is safe to repeat.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LinguapopAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LinguapopAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// An unrecognised or archived key answers 400 text/plain, not 401, so the
	// client tags it. Retrying cannot fix it: the key has to change.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof LinguapopAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Validation failures (400 problem+json), a missing route and a wrong
	// method all send the same request again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 405 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 408, or an abort or timeout on our side. The server may have processed a
	// write before the wait ran out, so only reads are repeated.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof LinguapopAPIError &&
			(error.status === 408 || error.timedOut),
		handler: async (error: Error) => ({
			maxRetries: isReplaySafe(error) ? 1 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// DNS, reset or refused connection: no HTTP response, nothing to read.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof LinguapopAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: isReplaySafe(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof LinguapopAPIError &&
			isReplaySafe(error) &&
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

/**
 * Caller handlers go first, then any built-in the caller did not name, then
 * DEFAULT. Core runs the first handler whose `match` passes, in key order, so
 * a caller handler for a status no built-in covers would otherwise lose to
 * the trailing DEFAULT.
 */
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
