import type { CorsairErrorHandler } from 'corsair/core';
import { MoceanAPIError } from './client';

function asMoceanError(error: Error): MoceanAPIError | undefined {
	return error instanceof MoceanAPIError ? error : undefined;
}

/**
 * Statuses and body codes: https://moceanapi.com/docs, per-API error tables.
 * Mocean answers most failures with HTTP 200/202 and a body status, so the
 * handlers mostly read `bodyStatus`, not the HTTP status.
 */
export const errorHandlers = {
	// Body status 32 is the documented throttle on every family (1 on the
	// verify family). Mocean does not document a Retry-After header, so the
	// exponential backoff below carries the wait.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => asMoceanError(error)?.isThrottled === true,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMoceanError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// HTTP 401, body status 1 (2 on the verify family): a bad or expired
	// token. Never retried.
	AUTH_ERROR: {
		match: (error: Error) => asMoceanError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Body status 2 (18 on verify): the account cannot pay for at least one
	// destination. No wait clears it, so it never retries.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => asMoceanError(error)?.isBalanceError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 40 maintenance and 45 "system error, please try again" mean the gateway
	// refused the request before running it, so any method can be sent again;
	// the same holds for the verify family's 3 and 21.
	RETRYABLE_SERVER_SIDE: {
		match: (error: Error) =>
			asMoceanError(error)?.isRetryableServerSide === true,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Every other body status is a request problem (bad number, invalid
	// message id, wrong code, ...): the same input fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			(asMoceanError(error)?.bodyStatus !== undefined &&
				asMoceanError(error)?.status === undefined),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is retried only for reads: a send that reached the gateway may
	// have charged the account even if the answer was lost.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMoceanError(error)?.replayable === true &&
			(asMoceanError(error)?.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Mocean, so a read
	// can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMoceanError(error)?.status === undefined &&
			asMoceanError(error)?.bodyStatus === undefined &&
			asMoceanError(error)?.replayable === true,
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
