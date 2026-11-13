import type { CorsairErrorHandler } from 'corsair/core';
import { CustomjsAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CustomjsAPIError ? error.status : undefined;
}

function isRateLimit(error: Error): boolean {
	return error instanceof CustomjsAPIError && error.isRateLimit;
}

function isTransport(error: Error): boolean {
	return error instanceof CustomjsAPIError && error.isTransportError;
}

/** A 5xx from CustomJS, as opposed to one from a gateway in front of it. */
function isServerFailure(error: Error): boolean {
	const status = statusOf(error);
	return status !== undefined && status >= 500;
}

/** The wait for a 429 that names no reset time. */
export const RATE_LIMIT_WINDOW_MS = 60_000;

export const errorHandlers = {
	// CustomJS answers an exhausted quota with 403 and the body
	// `{"message":"Too Many Requests"}`, not 429. On the live API (11-14) that
	// quota is per day (the free plan's 20 renders and executions, counted in
	// `x-ratelimit-remaining`), and the 403 carries no `Retry-After` and no
	// rate-limit headers. A retry inside the same day cannot succeed, so that 403
	// is reported at once. A 429, or a 403 that names a reset time, is retried.
	RATE_LIMIT_ERROR: {
		match: isRateLimit,
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof CustomjsAPIError ? error.retryAfter : undefined;
			const status =
				error instanceof CustomjsAPIError ? error.status : undefined;
			if (status === 403 && retryAfter === undefined) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfter ?? RATE_LIMIT_WINDOW_MS,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// The key is wrong, expired, or was never issued. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof CustomjsAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a malformed body, 404 an unknown page or script ID. CustomJS answers
	// some of these with a 500 instead (a nonexistent id returns `{}` with 500),
	// so a 5xx is only treated as retryable for a request that can be replayed.
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
	// A timeout or a dropped connection never reached CustomJS, so a read can go
	// again. A page creation is held back: the request may have been applied
	// before the connection broke.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			isTransport(error) && /timed out/i.test(error.message),
		handler: async (error: Error) => {
			const replayable = error instanceof CustomjsAPIError && error.replayable;
			return replayable
				? { maxRetries: 2, retryStrategy: 'linear_2s' as const }
				: { maxRetries: 0 };
		},
	},
	// Any other connection failure. A render is safe to repeat; publishing a page
	// is not, because the first attempt may have succeeded.
	NETWORK_ERROR: {
		match: isTransport,
		handler: async (error: Error) => {
			const replayable = error instanceof CustomjsAPIError && error.replayable;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	// A 5xx from CustomJS itself. The plugin decides what may be replayed, because
	// the failure may have happened after the work was done.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof CustomjsAPIError &&
			error.replayable &&
			isServerFailure(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx on a request that must not be repeated, and anything unrecognised.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays last.
 * A caller's own handlers go first so one matching a status no builtin covers
 * runs at all: with the builtin positions kept, the trailing `DEFAULT` claims that
 * error first.
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
