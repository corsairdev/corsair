import type { CorsairErrorHandler } from 'corsair/core';
import { ImejisioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ImejisioAPIError ? error.status : undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

/**
 * Longest quota reset worth sleeping through inside the call. A plan's window
 * can reset tens of minutes out, and blocking an endpoint that long is worse
 * than surfacing the 429, so longer resets fall back to plain backoff.
 */
const MAX_RETRY_AFTER_MS = 60_000;

export const errorHandlers = {
	/**
	 * A workspace with no active plan also answers 429, but that is a billing
	 * state which no amount of waiting clears — retrying just stalls the caller.
	 * Matched ahead of RATE_LIMIT_ERROR so it fails fast instead.
	 */
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof ImejisioAPIError && error.code === 'no-plan',
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * The render service answers 429 when the plan's render quota is exhausted,
	 * carrying `data.resetAt` (OpenAPI `QuotaError`). The client turns that into
	 * `retryAfter`, which is honoured when the reset is close enough to wait for.
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = messageOf(error);
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof ImejisioAPIError ? error.retryAfter : undefined;
			return {
				maxRetries: 5,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs:
					retryAfter !== undefined && retryAfter <= MAX_RETRY_AFTER_MS
						? retryAfter
						: undefined,
			};
		},
	},
	/**
	 * An unknown render key answers 404 `{ error: "Key not found" }` rather than
	 * 401, so it is classified by message before the not-found handler sees it.
	 */
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('key not found')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 404) return true;
			return messageOf(error).includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
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
