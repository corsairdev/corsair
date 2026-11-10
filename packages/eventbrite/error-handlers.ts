import type { CorsairErrorHandler } from 'corsair/core';
import { EventbriteAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof EventbriteAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof EventbriteAPIError ? error.code : undefined;
}

function retryAfterOf(error: Error): number | undefined {
	return error instanceof EventbriteAPIError ? error.retryAfter : undefined;
}

// Eventbrite's taxonomy: https://www.eventbrite.com/platform/docs/errors and
// the "Common Errors" table in the API reference. Every code is a constant
// string, so matching on it is stable across locales.
export const errorHandlers = {
	// 429 HIT_RATE_LIMIT: the token's hourly or daily quota. Eventbrite sends
	// no Retry-After, only the `x-rate-limit` header with a reset in seconds,
	// so a fixed 60-second wait is the only documented-ish delay. Writes are
	// not replayed beyond this: a 429 means the call was refused, not applied.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof EventbriteAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error) ?? 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 INVALID_AUTH / NO_AUTH, and 400 INVALID_AUTH / INVALID_AUTH_HEADER,
	// which Eventbrite also uses for a bad token. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return (
				status === 401 ||
				code === 'INVALID_AUTH' ||
				code === 'NO_AUTH' ||
				code === 'INVALID_AUTH_HEADER' ||
				code === 'ACCESS_DENIED'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 NOT_AUTHORIZED: the token's user may not act on this organization or
	// event, or the account lacks the API feature. Permanent.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || codeOf(error) === 'NOT_AUTHORIZED',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 NOT_FOUND, 400 ARGUMENTS_ERROR / INVALID_ARGUMENT / BAD_CONTINUATION_TOKEN
	// / BAD_PAGE, 409 REQUEST_CONFLICT, 405 METHOD_NOT_ALLOWED. Every one is the
	// caller's input; the next attempt would send the same thing.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (error.name === 'ZodError') return true;
			return (
				status === 400 || status === 404 || status === 405 || status === 409
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500 EXPANSION_FAILED is documented as likely to succeed without
	// expansions, and EXPANSION_FAILED plus INTERNAL_ERROR are the only 5xx
	// Eventbrite documents. Reads are replayable; a write is not, because a 500
	// on a write may still have been applied.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof EventbriteAPIError &&
			error.method === 'GET' &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	// Caller keys first: core takes the first handler whose match passes, so a
	// builtin key placed before a caller's would shadow it.
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
