import type { CorsairErrorHandler } from 'corsair/core';
import { LeigaAPIError } from './client';

function codeOf(error: Error): string | undefined {
	return error instanceof LeigaAPIError ? error.code : undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof LeigaAPIError ? error.status : undefined;
}

/**
 * Leiga's error surface is nearly all on HTTP 200 with a `{ code, msg }` body,
 * so most handlers match on the code rather than the status. Codes observed
 * live against the real API:
 *
 * - `5` `object not exist: ...`: a project, issue or workflow id that does not
 *   belong to this tenant. Fatal; the same request would fail again.
 * - `15` `accessToken error`: missing, expired or revoked token. The endpoint
 *   call has already replaced the token once and tried again by the time this
 *   handler sees the error, so a retry here would only repeat that.
 * - `18` `client_id error`: the client pair is wrong. Fatal.
 * - `100` `"<field> should not be null"`: a required input is missing. The
 *   schemas reject those before sending, so this means the provider requires a
 *   field its docs omit; the retry would be identical.
 *
 * A real HTTP status is still handled, because a gateway can answer 429 or 5xx
 * without Leiga's envelope, and `ApiError` surfaces those through the client.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429 || codeOf(error) === '429',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LeigaAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 15 and 18 arrive as HTTP 200, so a status check alone never sees them.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof LeigaAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5 is "object not exist" for a project, issue or workflow, and 100 is a
	// missing required field. Both are decided before the request matters.
	NOT_FOUND_ERROR: {
		match: (error: Error) => codeOf(error) === '5' || statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				// 100 is a missing required field the provider only reveals at
				// request time, so treat it as a request that cannot succeed.
				code === '100'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Leiga reports failures in the body, so a 5xx here is a gateway. Only reads
	// are replayed; every write in this plugin would otherwise be sent twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof LeigaAPIError &&
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
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
