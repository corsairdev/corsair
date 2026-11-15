import type { CorsairErrorHandler } from 'corsair/core';
import { ReferralrockAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ReferralrockAPIError ? error.status : undefined;
}

/**
 * Referral Rock's error taxonomy:
 *
 * - `401` is a missing or rejected Basic credential. A bad credential answers
 *   with HTML before routing, so the status is all there is to key on.
 * - `403` is a key that is valid but not allowed this route.
 * - `400` is a rejected write; Referral Rock validates a member and a referral
 *   on create.
 * - `404` is an unknown record or path.
 * - `5xx` is only replayed for a call the endpoint declared replayable.
 *
 * Referral Rock documents no throughput window and no `Retry-After`, so a 429 is
 * retried on the strategy's own backoff.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ReferralrockAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ReferralrockAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				(error instanceof ReferralrockAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof ReferralrockAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ReferralrockAPIError &&
			error.replayable &&
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
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
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
