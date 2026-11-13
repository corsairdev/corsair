import type { CorsairErrorHandler } from 'corsair/core';
import { RocketReachAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RocketReachAPIError ? error.status : undefined;
}

function creditTypeOf(error: Error): string | undefined {
	return error instanceof RocketReachAPIError ? error.creditType : undefined;
}

/**
 * Status codes: https://docs.rocketreach.co/reference/responses-and-errors and the
 * Response section of each endpoint.
 */
export const errorHandlers = {
	// A 429 carries a Retry-After in seconds, which the client reads. The global
	// ceiling is 10 requests a second; each route adds a per-plan per-minute
	// limit. A refused request ran nothing, so replaying it is safe even for a
	// lookup.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RocketReachAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: "Invalid API key". The key has to change.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: only /email/verify reports an empty balance this way, and it names the
	// pool in `credit_type` and a purchase URL. Retrying cannot refill it.
	OUT_OF_CREDITS_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 on a search or lookup means the lookup credits are gone, not that the
	// key lacks permission: the docs say so explicitly, and unlike the 402 there
	// is no `credit_type` to name the pool. Either way a retry cannot help.
	OUT_OF_LOOKUP_CREDITS_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 && creditTypeOf(error) === undefined,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed, 413 over 2.5 MB, 422 unprocessable: the caller has to send
	// something different.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 413 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the profile, company or request does not exist.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and only for an operation that declared itself replayable: every
	// lookup spends a credit, so a failed one is not sent again.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RocketReachAPIError && (error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable =
				error instanceof RocketReachAPIError && error.replayable;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
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
