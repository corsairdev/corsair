import type { CorsairErrorHandler } from 'corsair/core';
import { TldvAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TldvAPIError ? error.status : undefined;
}

/**
 * Status codes: https://doc.tldv.io, under "Errors". tl;dv sends a real HTTP
 * status (unlike a body-code provider), so the policy is built on status plus
 * the `name` field for the cases a status cannot separate.
 *
 * - `400` validation (`BadRequestError` with an `errors` array) is a request
 *   that would be identical on a retry.
 * - `401` (`AuthorizationRequiredError`) and `403` are a bad or missing key, or
 *   the User-Agent block, which returns 403 with no JSON body.
 * - `429` is documented on upload completion and is retried with `Retry-After`
 *   when present.
 * - `5xx` is only replayed for reads: `meetings.import` starts a job.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TldvAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 for a rejected key. 403 is kept separate: it is either the same
	// problem or the User-Agent filter, and neither improves on a retry.
	AUTH_ERROR: {
		match: (error: Error) => error instanceof TldvAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof TldvAPIError &&
			(error.status === 404 || error.code === 'NotFoundError'),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. `meetings.import` POSTs a job, so a 5xx may have
	// created one already.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TldvAPIError &&
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
