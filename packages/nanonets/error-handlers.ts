import type { CorsairErrorHandler } from 'corsair/core';
import { NanonetsAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof NanonetsAPIError ? error.status : undefined;
}

// Status codes and retry guidance:
// https://docs.nanonets.com/reference/overview
export const errorHandlers = {
	// 429 on the predict endpoints, per model per 1-minute window. A rejected
	// request never ran, so every operation is safe to replay. The documented
	// backoff is 30s then 60s then 120s, and corsair's strategy enums top out
	// at 4s per attempt, which would burn every retry inside the still-closed
	// window. headersRetryAfterMs is the only verbatim-delay channel, so the
	// documented 30s initial delay rides there whenever the response did not
	// send its own Retry-After, which is honored first.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NanonetsAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof NanonetsAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: 30_000,
		}),
	},
	// 402: the free API call quota is exhausted. A retry bills nothing but
	// cannot succeed until the plan changes.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof NanonetsAPIError && error.isQuotaExhausted,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: a missing or wrong API key. A retry sends the same credential.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key cannot use the model or operation.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the model, file or integration does not exist.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: missing file, invalid image, unknown category, model not ready for
	// training. The request has to change before a retry can work.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: predictions and every workflow action carry no
	// idempotency key, so a replayed write could double-charge quota or
	// re-trigger exports.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NanonetsAPIError &&
			error.replaySafe === true &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last. User keys order before builtin keys: core runs the first handler
// whose match passes, so a user handler under a new name must not lose to an
// overlapping builtin match. A user handler under a builtin name replaces it.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const key of Object.keys(builtinRest)) {
		if (!(key in merged)) {
			merged[key] = builtinRest[key];
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
