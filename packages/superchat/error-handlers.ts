import type { CorsairErrorHandler } from 'corsair/core';
import { asRecord } from 'corsair/core';
import { ApiError } from 'corsair/http';

// HTTP failures arrive as core's ApiError. Transport failures
// (SuperchatAPIError) carry no status and fall through to DEFAULT.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function exceptionCode(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const code = asRecord(error.body)?.exceptionCode;
	return typeof code === 'string' ? code : undefined;
}

/**
 * Superchat answers `{ exception, exceptionCode, userErrorMessage }`, and the
 * user message can be localised, so the code is what a handler matches on.
 *
 * Rate limits: 2500 requests per 5-minute window per workspace, shared across
 * keys, plus a 10000-call lifetime cap on a trial. Both answer 429 and the body
 * does not distinguish them, so a 429 is retried with backoff, which is right
 * for the window and harmless for the exhausted trial because the retries are
 * bounded to three.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a missing key and 403 a key Superchat does not recognise, so both
	// mean the credential is wrong rather than a scope being absent.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404, or a NotFoundException code: no such contact, conversation, message
	// or channel.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 404 || exceptionCode(error) === 'NotFoundException',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: a field failed validation, such as a contact with no handle or
	// a snooze without a time. 405: the route does not accept this method, which
	// usually means the base path lost its `v1.0` segment.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 405 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. Sending a message twice is not: the
	// first attempt may already have been delivered to a real person.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. Caller keys come first so a
 * handler they added actually runs.
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
			merged[name as keyof CorsairErrorHandler] = entry;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
