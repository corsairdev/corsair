import type { CorsairErrorHandler } from 'corsair/core';
import { ZenRowsAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ZenRowsAPIError ? error.status : undefined;
}

function isZenrowsError(error: Error): error is ZenRowsAPIError {
	return error instanceof ZenRowsAPIError;
}

// Codes and statuses: https://docs.zenrows.com/api-error-codes
export const errorHandlers = {
	// A 402 (out of credits) and a 429 that names credits are both permanent
	// for the period, so this sits before RATE_LIMIT_ERROR: core takes the first
	// handler whose match passes, and AUTH004/AUTH014 arrive as 402 while a
	// credit cap on a crawl arrives as 429.
	CREDITS_ERROR: {
		match: (error: Error) => isZenrowsError(error) && error.isOutOfCredits,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Two different conditions share 429: AUTH006 (every concurrency slot is
	// in use, no Retry-After) and AUTH008 (rate limit exceeded). Both clear on
	// their own, so both retry, but a concurrency slot frees within seconds
	// while a rate limit needs longer: the documented advice for AUTH006 is
	// exponential backoff, which is what the fallback below is.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isZenrowsError(error) && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ZenRowsAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// AUTH001-AUTH003 and AUTH005: no key, a malformed key, an unknown key, or
	// an expired one. `unauthenticated` is the Batch and Crawl spelling.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401) return true;
			return (
				error instanceof ZenRowsAPIError &&
				[
					'AUTH001',
					'AUTH002',
					'AUTH003',
					'AUTH005',
					'unauthenticated',
				].includes(error.code ?? '')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// AUTH009 (email unverified), AUTH010/AUTH012 (plan lacks the feature),
	// BLK0001 (IP blocked for error rate) and REQS007 (Extract refused the
	// page). None is fixed by sending the same request again.
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 403) return true;
			return (
				error instanceof ZenRowsAPIError &&
				['permission_denied', 'webhook_signing_key_required'].includes(
					error.code ?? '',
				)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// REQS001 (domain forbidden), REQS004 (invalid parameters), REQS005
	// (method not allowed) and REQS006 (bad CAPTCHA key) are all permanent.
	// `invalid_argument` is the Crawl and Extract spelling of the same thing.
	REQUEST_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 400) return true;
			return (
				error instanceof ZenRowsAPIError &&
				[
					'REQS001',
					'REQS004',
					'REQS005',
					'REQS006',
					'invalid_argument',
				].includes(error.code ?? '')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// RESP002 and RESP007 both answer 404: RESP002 is a page that is not there,
	// RESP007 a domain that does not resolve. `crawl_not_found` and
	// Extract's `not_found` are the same kind of permanent answer.
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 404) return true;
			return (
				error instanceof ZenRowsAPIError &&
				['crawl_not_found'].includes(error.code ?? '')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 413 means the answer was bigger than the plan allows: the fix is to ask
	// for less, so a retry sends the same oversized request.
	RESPONSE_TOO_LARGE_ERROR: {
		match: (error: Error) => statusOf(error) === 413,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 is the target, not Zenrows: RESP001 (content could not be returned
	// under this configuration), no_data_extracted and blocked_document. All
	// three answer the same on a retry, per the docs.
	UNPROCESSABLE_ERROR: {
		match: (error: Error) => statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409/410 are state, not transport: a conflict on idempotency or a task
	// whose content aged out. Replaying cannot change either.
	CONFLICT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 409 || status === 410;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 408 never reaches the provider, and 424 is a CAPTCHA solver failure that
	// the next attempt usually hits again: the solver ran out of balance.
	TIMEOUT_ERROR: {
		match: (error: Error) => statusOf(error) === 408,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	CAPTCHA_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				status === 424 || (isZenrowsError(error) && error.code === 'RESP006')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is Zenrows' own trouble and safe to replay only for a method the
	// provider treats as a read. A crawl start is a POST that spends credits,
	// and a Fetch POST or PUT reaches the target with a body, so none of them
	// is replayed: `method` is recorded on the error for exactly this test.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof ZenRowsAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. A plain spread would keep
 * the caller's value but the builtin's position, and a caller handler for a
 * status no builtin covers would then never run.
 */
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
