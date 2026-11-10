import type { CorsairErrorHandler } from 'corsair/core';
import { isReplayable, SatisMeterAPIError } from './client';

function isApi(error: Error): error is SatisMeterAPIError {
	return error instanceof SatisMeterAPIError;
}

/**
 * SatisMeter documents no rate limit, no backoff window and no `Retry-After` in
 * any of its responses, so every delay below is a fixed one chosen here rather
 * than a provider instruction.
 *
 * Two things drive the split. A GET is safe to replay: it reads survey data and
 * changes nothing. A write is not: `users.track` counts the event every time it
 * arrives, and `users.upsert` re-applies traits, so replaying a 5xx that the
 * provider actually processed would double-count an event. Every write handler
 * therefore checks `isReplayable` and gives up rather than guessing.
 *
 * The users API and the v3 reads also disagree on their errors: a bad key is a
 * 403 `Not authorized` on the users API, while a v3 read looks the project up
 * first and answers 404 `Project not found` before the key is ever checked. Both
 * are terminal here, which is the only thing a retry decision needs from them.
 */
export const errorHandlers = {
	// A write reached the users API with no usable credential: 400 "No write
	// key". Nothing about the request changes on a retry.
	MISSING_WRITE_KEY: {
		match: (error: Error) => isApi(error) && error.isMissingWriteKey,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 "Not authorized" / "Forbidden": the key was refused, so a retry sends
	// the same rejected credential.
	AUTH_ERROR: {
		match: (error: Error) => isApi(error) && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 "Project not found", "Campaign not found" or "User not found".
	//
	// On a v3 read this can also mean a wrong key, because the project is looked
	// up before the credential: the body is identical either way, so this does
	// not retry and does not claim the key was right. The message the caller sees
	// carries the provider's own sentence.
	NOT_FOUND_ERROR: {
		match: (error: Error) => isApi(error) && error.isResourceNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 is documented nowhere but a gateway in front of the API can send
	// one. Retried, using Retry-After when present; a read only, because a
	// throttled write may have been applied before the gateway answered.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isApi(error) && error.status === 429,
		handler: async (error: Error) => {
			const api = error instanceof SatisMeterAPIError ? error : undefined;
			if (!api?.isReplayable) return { maxRetries: 0 };
			return api.retryAfter === undefined
				? {
						maxRetries: 2,
						retryStrategy: 'exponential_backoff_jitter' as const,
					}
				: { maxRetries: 2, headersRetryAfterMs: api.retryAfter };
		},
	},
	// The client's own deadline. The provider may still be working, and for a
	// write it may already have applied the change: no retry either way.
	TIMEOUT_ERROR: {
		match: (error: Error) => isApi(error) && error.isTimeout,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Headers arrived but the body did not: the request ran, so this is not a
	// transport failure and must not be replayed. Listed before TIMEOUT_ERROR and
	// NETWORK_ERROR, either of which could otherwise claim it.
	BODY_READ_ERROR: {
		match: (error: Error) => isApi(error) && error.isBodyReadFailure,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A connection that never produced a response did not reach SatisMeter, so
	// a read can be replayed. A write may still have been applied by a proxy, so
	// it is not replayed.
	NETWORK_ERROR: {
		match: (error: Error) => isApi(error) && error.isTransport,
		handler: async (error: Error) => {
			const api = error instanceof SatisMeterAPIError ? error : undefined;
			return api?.isReplayable
				? { maxRetries: 1, retryStrategy: 'linear_2s' as const }
				: { maxRetries: 0 };
		},
	},
	// 500: a bounded replay of a read; a write stops, because the write may have
	// landed and only the answer was lost.
	SERVER_ERROR: {
		match: (error: Error) => isApi(error) && (error.status ?? 0) >= 500,
		handler: async (error: Error) =>
			isApi(error) && isReplayable(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// 400 and 422 are requests the API refused. A retry sends the same one.
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
