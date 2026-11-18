import type { CorsairErrorHandler } from 'corsair/core';
import { TikHubAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (!(error instanceof TikHubAPIError)) return undefined;
	return error.status ?? error.code;
}

function messageIncludes(error: Error, needles: string[]): boolean {
	const haystack = error.message.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// Status codes: https://docs.tikhub.io/4592766m0 ("HTTP Status Codes").
// TikHub bills only successful calls, so retrying a failed one costs nothing.
export const errorHandlers = {
	// 422 is FastAPI rejecting the query parameters; a retry sends the same ones.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the balance (or free credit, for endpoints that accept it) cannot
	// cover the call. Waiting does not add funds. The message check only
	// applies when there is no status, so a 429 or 5xx keeps its own retries.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 ||
			(error instanceof TikHubAPIError &&
				statusOf(error) === undefined &&
				messageIncludes(error, ['insufficient balance'])),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: over the per-key rate limit (documented as 10 requests/second).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TikHubAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: token missing, invalid, expired, or not activated.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token lacks this route's scope, the account is disabled, or
	// the email is unverified.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// TikHub answers 400 when the upstream platform call fails ("Request
	// failed, please retry ... This request will not be charged"), not only
	// for malformed input, which FastAPI reports as 422.
	UPSTREAM_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The request may have finished (and been billed) server-side after the
	// client gave up, so it is not replayed.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(statusOf(error) === undefined && timedOut(error)),
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
