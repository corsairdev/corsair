import type { CorsairErrorHandler } from 'corsair/core';
import { TapfiliateAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TapfiliateAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof TapfiliateAPIError ? error.code : undefined;
}

// Status codes: https://developers.tapfiliate.com/api-reference/errors. The
// rate limits are per key and per endpoint, from 10 to 1500 requests in a
// window, and a 429 carries no Retry-After header.
export const errorHandlers = {
	// Tapfiliate says to wait until X-RateLimit-Reset, which the client cannot
	// read with the body, so the fallback is a minute: the widest documented
	// window (payments and notes, 300 per 15 minutes) still recovers within it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TapfiliateAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 from either envelope: a wrong or revoked key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's permissions or the plan does not cover this feature, such
	// as click reports or affiliate groups.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 on a commission that Tapfiliate Pay already approved, or on a coupon
	// another affiliate holds. The request has to change, so a retry is wasted.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 validation and business errors, and 404 for an unknown id.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A failed conversion create charges the affiliate
	// a commission, and a repeated payment records a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TapfiliateAPIError &&
			error.method === 'GET' &&
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

// Core runs the first handler whose `match` passes and DEFAULT matches
// everything, so caller keys go first, then any builtin the caller did not
// name, and DEFAULT last.
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
