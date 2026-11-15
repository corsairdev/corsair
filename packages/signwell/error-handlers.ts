import type { CorsairErrorHandler } from 'corsair/core';
import { SignwellAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SignwellAPIError ? error.status : undefined;
}

/**
 * Status codes: https://developers.signwell.com/reference/getting-started-with-your-api-1
 *
 * SignWell limits each token to 100 requests per 60 seconds, 20 per minute in
 * test mode, and 30 per minute for document and template creation. It does not
 * document a Retry-After header, so a 429 falls back to backoff.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// SignWell refused the request before running it, so any method is safe
		// to replay.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SignwellAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the token was revoked or is not valid. SignWell answers this for an
	// missing document id too when the token is bad, so it always means auth.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SignwellAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: a field failed validation, e.g. a recipient with no email, or both
	// file_url and file_base64. The errors object names the field. Retrying
	// sends the same invalid request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: a missing document, template, webhook or bulk send. 409: a recipient
	// already started signing, so the update cannot apply. Neither is retryable.
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 404 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// SignWell documents 500 as "something went very, very wrong". Only reads are
	// replayed: a create, send or delete may already have landed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SignwellAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
