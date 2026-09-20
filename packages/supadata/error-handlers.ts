import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Supadata's documented error codes, carried in the `error` field of the
 * standard error payload.
 * https://docs.supadata.ai/api-reference/introduction
 */
function supadataErrorCode(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body: unknown = error.body;
	if (!body || typeof body !== 'object') return undefined;
	const code = (body as Record<string, unknown>).error;
	return typeof code === 'string' ? code : undefined;
}

function hasStatus(error: Error, ...statuses: number[]): boolean {
	return error instanceof ApiError && statuses.includes(error.status);
}

export const errorHandlers = {
	/** HTTP 429 / `limit-exceeded` — the plan's per-second rate limit. */
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			hasStatus(error, 429) || supadataErrorCode(error) === 'limit-exceeded',
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff_jitter' as const,
			...(error instanceof ApiError && error.retryAfter !== undefined
				? { headersRetryAfterMs: error.retryAfter }
				: {}),
		}),
	},

	/** HTTP 401 / `unauthorized` — a missing or invalid API key. Never retried. */
	AUTH_ERROR: {
		match: (error: Error) =>
			hasStatus(error, 401) || supadataErrorCode(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * HTTP 402/403 — `forbidden`, or `upgrade-required` when the account's plan
	 * does not include the endpoint. Retrying cannot change the outcome.
	 */
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const code = supadataErrorCode(error);
			return (
				hasStatus(error, 402, 403) ||
				code === 'forbidden' ||
				code === 'upgrade-required'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * HTTP 404 — an unknown job id or video, or `transcript-unavailable` when
	 * the media has no transcript and none can be generated.
	 */
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const code = supadataErrorCode(error);
			return (
				hasStatus(error, 404) ||
				code === 'not-found' ||
				code === 'transcript-unavailable'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/** HTTP 400 / `invalid-request` — a malformed request. Not retryable. */
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			hasStatus(error, 400) || supadataErrorCode(error) === 'invalid-request',
		handler: async () => ({ maxRetries: 0 }),
	},

	/** HTTP 5xx / `internal-error` — transient on Supadata's side. */
	SERVER_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status >= 500) ||
			supadataErrorCode(error) === 'internal-error',
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	/** The 20s request deadline in `client.ts` elapsed. */
	TIMEOUT_ERROR: {
		match: (error: Error) => error.name === 'TimeoutError',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'linear_2s' as const,
		}),
	},

	/** fetch() could not reach the API, or refused to follow a redirect. */
	NETWORK_ERROR: {
		match: (error: Error) =>
			!(error instanceof ApiError) &&
			(error.name === 'TypeError' ||
				/fetch failed|redirect/i.test(error.message)),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'linear_2s' as const,
		}),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
