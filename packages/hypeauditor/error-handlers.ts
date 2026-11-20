import type { CorsairErrorHandler } from 'corsair/core';
import { HypeAuditorAPIError, HypeAuditorTransportError } from './client';

function failure(error: Error): HypeAuditorAPIError | undefined {
	return error instanceof HypeAuditorAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return failure(error)?.status;
}

function codeOf(error: Error): number | undefined {
	return failure(error)?.code;
}

function retryAfterMs(error: Error): number | undefined {
	const value = failure(error)?.retryAfter;
	return value !== undefined && value > 0 ? value : undefined;
}

/**
 * Codes and statuses: https://hypeauditor.readme.io/reference/basic, which lists
 * the status codes, and the per-endpoint pages for the body codes.
 *
 * The same status carries different meanings, so the body code is matched where
 * the docs name one:
 *
 * - `403` is both a bad token (`code 4`) and a private or empty account, so
 *   it is treated as auth and never retried.
 * - `405` is `code 3` `Unknown method passed`: the action name is wrong, which
 *   is a plugin defect rather than a transient failure.
 * - `402` is out of credits or an expired API subscription. No retry can fix it.
 */
export const errorHandlers = {
	// 402 Payment Required. The docs are explicit that this is an exhausted
	// balance or an expired subscription, so retrying only delays the failure.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 Unauthorized. The token changed (the docs note it changes with the
	// password), or the account is private, or it has no posts.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 403 || codeOf(error) === 4,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 Not Found: the user or page does not exist.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 405 with `code 3`: the action name is not a real method.
	METHOD_NOT_ALLOWED_ERROR: {
		match: (error: Error) => statusOf(error) === 405 || codeOf(error) === 3,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: a parameter the API refused. A rejected input schema is the same
	// class of mistake, so it shares this decision.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: over the documented just-under-100-per-minute limit. `Retry-After` is
	// honoured when a gateway sends one.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			const wait = retryAfterMs(error);
			return wait !== undefined
				? { maxRetries: 3, headersRetryAfterMs: wait }
				: { maxRetries: 3, retryStrategy: 'exponential_backoff' as const };
		},
	},
	/**
	 * 500: the docs say the service is temporarily unavailable and to try later.
	 * A report or discovery read may already have spent a credit by the time it
	 * answers, so only a call marked replayable is repeated.
	 */
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: failure(error)?.replayable ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The client's own timeout, which it records because the name that
	// identified it is lost when the failure is re-thrown.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 ||
			(error instanceof HypeAuditorTransportError && error.timedOut),
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof HypeAuditorTransportError && error.replayable ? 2 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// A reset connection or a DNS failure: the request never reached the
	// provider. Safe for a read, and not for a credit-spending one.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof HypeAuditorTransportError && !error.timedOut,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof HypeAuditorTransportError && error.replayable ? 2 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys go first: a
// caller handler for a status no builtin covers would otherwise never run,
// because the trailing DEFAULT claims that error first.
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
