import type { CorsairErrorHandler } from 'corsair/core';
import {
	EventzillaAPIError,
	EventzillaTransportError,
	// EventzillaTransportError's kind decides transport retries below.
} from './client';

function kindOf(error: Error): string | undefined {
	if (error instanceof EventzillaAPIError) return error.kind;
	if (error instanceof EventzillaTransportError) return error.kind;
	return undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof EventzillaAPIError ? error.status : undefined;
}

/**
 * Reads only: `method === 'GET'`. Eventzilla's writes are not documented as
 * idempotent, and several of them are not repeatable at all in effect — a
 * checkout confirmed twice, or an order cancelled after it shipped, is not the
 * same call twice. So a 5xx on a write is handed back rather than replayed.
 */
function isReplayableRead(error: Error): boolean {
	const method = error instanceof EventzillaAPIError ? error.method : undefined;
	return method === 'GET';
}

/**
 * Eventzilla documents no rate limit, no 429 and no backoff anywhere in its
 * reference, and a probe of every documented route never produced one. A
 * gateway in front of the API can still answer 429, so it is handled rather
 * than left to DEFAULT, which would fail the call immediately. The window is
 * not documented, so a Retry-After is honoured when present and the fallback
 * stays short.
 */
const RETRY_AFTER_FALLBACK_MS = 1000;

export const errorHandlers = {
	// Keyless or refused key. Eventzilla's own 401 body is
	// `{"message":"API Key is not authorized"}`. Never retried: the same key
	// cannot start working.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 is one of two unrelated things. API Gateway says
	// `Missing Authentication Token` for a route that does not exist, which
	// comes through as kind `invalid_route`; anything else is a real
	// permission refusal. Neither is fixed by repeating the request.
	INVALID_ROUTE_ERROR: {
		match: (error: Error) => kindOf(error) === 'invalid_route',
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 404 (unknown event, attendee, checkout or reference). The
	// request has to change before a retry can help.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				kindOf(error) === 'invalid_input' ||
				kindOf(error) === 'not_found'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof EventzillaAPIError
					? (error.retryAfter ?? RETRY_AFTER_FALLBACK_MS)
					: RETRY_AFTER_FALLBACK_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx may mean the write already happened, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			statusOf(error) !== undefined &&
			(statusOf(error) ?? 0) >= 500 &&
			isReplayableRead(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx on a write: it may have gone through, so it is not repeated.
	SERVER_ERROR_WRITE: {
		match: (error: Error) =>
			statusOf(error) !== undefined && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A transport failure never reached Eventzilla, so the write did not
	// happen either. Replaying it is safe. A timeout is the exception: the
	// request may have arrived and finished server-side, so a write is not
	// repeated on one.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof EventzillaTransportError &&
			error.kind === 'network' &&
			error.method === 'GET',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TRANSPORT_ERROR_WRITE: {
		match: (error: Error) => error instanceof EventzillaTransportError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Anything left: a body that failed to parse, an unexpected status. The
	// request is not repeated blindly.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Core runs the first handler whose `match` passes, in key order, so DEFAULT
 * stays last. A caller's own handlers go first — that is what makes an
 * override take effect — and their DEFAULT, when they set one, replaces this
 * plugin's.
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
		if (!(name in merged)) {
			// unknown: the entry is a CorsairErrorHandler member, which core
			// declares as a Partial; Object.entries erases that per value.
			merged[name as keyof CorsairErrorHandler] =
				entry as CorsairErrorHandler[keyof CorsairErrorHandler];
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
