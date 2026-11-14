import type { CorsairErrorHandler } from 'corsair/core';
import { ScrapingAntAPIError } from './client';

function isApi(error: Error): error is ScrapingAntAPIError {
	return error instanceof ScrapingAntAPIError;
}

/**
 * ScrapingAnt has no documented read/write or backoff window: every operation
 * here is a GET that asks the provider to fetch a page, and the docs say only
 * to use "a small maximum attempt count and increasing delays with jitter".
 *
 * The 409 on a free plan is the one failure with a stated retry rule: wait for
 * the active request to finish and send one request, so it gets the longest
 * delay and the fewest attempts. ScrapingAnt sends no `Retry-After` on any
 * documented failure; only a 429 from a gateway in front of it carries one, and
 * that is the single place `headersRetryAfterMs` is read from a header.
 *
 * The cost of a wrong retry here is money, not just time: every scrape spends
 * credits, so a replay after an outcome the provider already charged for pays
 * twice. That is why the body-read failure and the client deadline both stop,
 * while only a request that provably never left (DNS, refused connection) may
 * retry.
 */
export const errorHandlers = {
	// 403 "Requests quota limit reached". No retry can restore credits, and the
	// message also arrives at 403 beside the two access failures, so it must be
	// matched before AUTH_ERROR/Permission, which would otherwise claim it.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => isApi(error) && error.isQuotaExhausted,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 "Access denied from this IP address". The account's allowlist has to
	// change before the same request can work.
	IP_BLOCKED_ERROR: {
		match: (error: Error) => isApi(error) && error.isIpBlocked,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 "API token is wrong".
	AUTH_ERROR: {
		match: (error: Error) => isApi(error) && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 on a free plan: one request at a time, and the documented fix is to
	// wait for the active one. A paid plan never sends this, and any other 409
	// is left to DEFAULT rather than retried as a queue.
	CONCURRENCY_LIMIT_ERROR: {
		match: (error: Error) => isApi(error) && error.isConcurrencyLimit,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'linear_4s' as const,
		}),
	},
	// 423: the target detected the browser. A bounded retry can come back clean,
	// and the docs suggest changing proxy country or type if it does not; no
	// setting changes here, so one attempt is all this adds.
	BOT_DETECTED_ERROR: {
		match: (error: Error) => isApi(error) && error.isBotDetected,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_4s' as const,
		}),
	},
	// 404 "This site can't be reached" covers both an unreachable target and a
	// worker timeout, so a bounded retry is worth one attempt. It is not a
	// missing resource on ScrapingAnt's side.
	TARGET_UNREACHABLE_ERROR: {
		match: (error: Error) => isApi(error) && error.isTargetUnreachable,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// Headers arrived but the body did not: the scrape ran and was charged, so a
	// retry spends those credits again for the same page. Listed before
	// TIMEOUT_ERROR and NETWORK_ERROR because it can look like either.
	BODY_READ_ERROR: {
		match: (error: Error) => isApi(error) && error.isBodyReadFailure,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The client's own deadline, listed before NETWORK_ERROR because a timeout
	// is also a transport failure and would otherwise be retried by it. The
	// provider allows up to 60 seconds per scrape, so a client timeout may leave
	// a request the provider is still running, and a replay pays for that scrape
	// a second time: no retry.
	TIMEOUT_ERROR: {
		match: (error: Error) => isApi(error) && error.isTimeout,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only a request that provably never left is replayed (DNS, refused or
	// unreachable connection, connect timeout). A connection that dropped after
	// the request was written may have started a charged scrape, so it falls to
	// DEFAULT with no retry.
	NETWORK_ERROR: {
		match: (error: Error) =>
			isApi(error) &&
			error.isTransport &&
			error.isNotSent &&
			!error.isBodyReadFailure,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// ScrapingAnt documents no throughput limit and sends no Retry-After of its
	// own, but a gateway in front of it can answer 429. Retried so the call does
	// not die on a throttle the provider never intended to be terminal, using
	// Retry-After when the gateway supplies one.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isApi(error) && error.status === 429,
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof ScrapingAntAPIError ? error.retryAfter : undefined;
			return retryAfter === undefined
				? {
						maxRetries: 2,
						retryStrategy: 'exponential_backoff_jitter' as const,
					}
				: { maxRetries: 2, headersRetryAfterMs: retryAfter };
		},
	},
	// 500 covers server failures and both extraction stages (AI and Markdown),
	// which the docs say to retry with bounded delays. Every operation is a GET,
	// so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) => isApi(error) && (error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 422 is a parameter the provider refused, including a key that is missing
	// rather than wrong. A retry sends the same parameters.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return isApi(error) && error.status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it has to
 * stay last. A plain spread keeps a caller's value but the builtin's position,
 * which means a caller handler for a status no builtin covers never runs: the
 * builtin `DEFAULT` matches that error first.
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
