import type { CorsairErrorHandler } from 'corsair/core';
import { isReplayable, ScrapeDoAPIError } from './client';

function isApi(error: Error): error is ScrapeDoAPIError {
	return error instanceof ScrapeDoAPIError;
}

/**
 * Scrape.do documents no rate-limit window and sends no `Retry-After` on any
 * documented failure. It does document a retry contract of its own — the 502
 * "please try again" and the 429 concurrency limit — so the delays below are
 * fixed choices, not provider instructions.
 *
 * Two things drive the split. A GET is a fetch and safe to replay. A POST
 * through this API forwards its body to the target site, so a 5xx may mean the
 * target applied the write: those stop.
 *
 * The 400 is the subtle one. Scrape.do documents **two different 400s**: one for
 * a bad request to Scrape.do (no credit consumed, retrying is pointless) and one
 * for a bad request *to the target* (a credit is consumed). `isTargetRejection`
 * reads `PossibleCauses` to tell them apart; both are terminal here, but the
 * distinction is exposed on the error so a caller can tell why.
 */
export const errorHandlers = {
	// 401: the token is inactive or the subscription is suspended. The docs warn
	// that repeating an invalid token gets the IP throttled by the auth server,
	// so this must not retry even once.
	AUTH_ERROR: {
		match: (error: Error) => isApi(error) && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 510: the caller's own client cancelled, so there is nothing to send again.
	CLIENT_CANCELLED_ERROR: {
		match: (error: Error) => isApi(error) && error.isClientCancelled,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: the account's concurrency limit, which the docs say is not charged.
	// The documented fix is to wait and send the same request, so a read waits
	// and retries; a forwarded write does not, since it may have reached the
	// target before the limit was hit.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isApi(error) && error.isConcurrencyLimit,
		handler: async (error: Error) => {
			const api = error instanceof ScrapeDoAPIError ? error : undefined;
			if (!api?.isReplayable) return { maxRetries: 0 };
			return api.retryAfter === undefined
				? { maxRetries: 3, retryStrategy: 'linear_2s' as const }
				: { maxRetries: 3, headersRetryAfterMs: api.retryAfter };
		},
	},
	// The client's own deadline. Scrape.do's `timeout` parameter allows up to 120
	// seconds and its retry mechanism can add more, so a client timeout may leave
	// a request the provider is still running: no retry.
	TIMEOUT_ERROR: {
		match: (error: Error) => isApi(error) && error.isTimeout,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A connection that never produced a response did not reach Scrape.do, so a
	// read can be replayed. A write may still have landed through the proxy.
	NETWORK_ERROR: {
		match: (error: Error) => isApi(error) && error.isTransport,
		handler: async (error: Error) => {
			const api = error instanceof ScrapeDoAPIError ? error : undefined;
			return api?.isReplayable
				? { maxRetries: 1, retryStrategy: 'linear_2s' as const }
				: { maxRetries: 0 };
		},
	},
	// 502 is Scrape.do asking for a retry, and it costs no credit. 5xx above it
	// is treated the same for a read; a forwarded write stops.
	SERVER_ERROR: {
		match: (error: Error) => isApi(error) && error.isRetryableServerError,
		handler: async (error: Error) =>
			isApi(error) && isReplayable(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// 400/422 are requests Scrape.do refused. A retry sends the same one. The two
	// 400 meanings are both matched here because neither changes on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return isApi(error) && (error.status === 400 || error.status === 422);
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
