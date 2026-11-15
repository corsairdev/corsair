import type { CorsairErrorHandler } from 'corsair/core';
import { SignpathAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SignpathAPIError ? error.status : undefined;
}

/**
 * SignPath documents no rate limit and publishes no rate-limit headers, so the
 * only 429 a caller sees comes from a gateway in front of it. Retrying is safe
 * for every method: the gateway refused the request before SignPath saw it.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SignpathAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the token is not parseable, expired, or belongs to a user who is not
	// a member of the organization in the path. Re-sending it cannot help.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the user is authenticated but their role cannot perform the change,
	// e.g. a reader editing a project or a submitter approving a request.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 (a malformed body or an invalid slug), 404 (a missing project, policy,
	// certificate or signing request), and 410 (an expired signed artifact
	// link). A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 410
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// SignPath documents no 5xx behaviour. Only reads are replayed: a failed
	// submit or approval may already have been recorded.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SignpathAPIError &&
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
