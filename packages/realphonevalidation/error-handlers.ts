import type { CorsairErrorHandler } from 'corsair/core';
import { RealPhoneValidationAPIError } from './client';

function apiError(error: Error): RealPhoneValidationAPIError | undefined {
	return error instanceof RealPhoneValidationAPIError ? error : undefined;
}

/**
 * These services report most refusals inside a `200` body, and the client turns
 * those into a RealPhoneValidationAPIError before the output schema sees them. The
 * status-based handlers below cover the remaining cases: the documented `403` for
 * throttling, and the transport failures.
 *
 * Docs: https://realphonevalidation.com/api-documentation/ and the Appendix A table
 * on each service's page.
 */
export const errorHandlers = {
	// The docs recommend 10 calls a second and answer a burst with a 403 that has
	// an empty body. There is no Retry-After documented, so the delay is
	// exponential unless a header happens to arrive. A refused call ran nothing.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return api?.isRateLimit === true && api.status !== 401;
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The token was refused, either by status or by the body's own word:
	// unauthorized, "missing token", "user is invalid".
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Code 102: the account is out of balance. Retrying cannot refill it.
	QUOTA_ERROR: {
		match: (error: Error) => apiError(error)?.isQuotaError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// invalid phone, invalid-format, invalid-phone, bad-zip-code, or -1 for a
	// missing number. The caller has to send a different value.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// server-unavailable, or a 5xx. Every route here is a read, so a retry cannot
	// duplicate anything, but the service is usually down rather than flaky, so
	// only one retry is allowed.
	SERVER_ERROR: {
		match: (error: Error) => apiError(error)?.isServerError === true,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Handlers match in key order and DEFAULT matches everything, so it stays last. */
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
