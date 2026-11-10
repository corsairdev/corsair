import type { CorsairErrorHandler } from 'corsair/core';
import { MailssoAPIError, MailssoSubscriptionRequiredError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof MailssoAPIError ? error.status : undefined;
}

// Mails.so documents 400, 401 and a paid-plan 401 for batches; the rest were
// observed live: 404 `the job does not exist` and 400 `invalid job id` on
// batches.getBatch, 400 BATCH_TOO_SMALL on batches.create, and a 500 `failed to
// check job status` on a batch job that never held any emails.
export const errorHandlers = {
	// A free key on a batch route. It answers 401, which AUTH_ERROR would also
	// claim, so this sits first. A retry cannot buy a subscription.
	SUBSCRIPTION_REQUIRED_ERROR: {
		match: (error: Error) => error instanceof MailssoSubscriptionRequiredError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Mails.so documents no rate limit, but a 429 from it or from the gateway in
	// front of it stops before the route runs, so a write is safe to repeat.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof MailssoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof MailssoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 for a missing or wrong x-mails-api-key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a malformed body or a batch of fewer than two different emails, and
	// 404 for a batch job id that does not exist. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed on a 5xx: a batch that failed on the way back may
	// already exist, and Mails.so has no idempotency key to stop a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof MailssoAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A reset, DNS failure or timeout never reached Mails.so, so a read can be
	// repeated. A write may have reached it before the connection dropped.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof MailssoAPIError &&
			error.transport &&
			error.method === 'GET',
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

/**
 * Merges a caller's handlers over the builtins, keeping `DEFAULT` last.
 *
 * Core runs the first handler whose `match` passes, in key order, and `DEFAULT`
 * matches everything. Caller keys go first so a handler for a status no builtin
 * covers is reached before `DEFAULT` claims it; a caller `DEFAULT` replaces the
 * builtin one, and the builtin `DEFAULT` is only used when the caller has none.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
