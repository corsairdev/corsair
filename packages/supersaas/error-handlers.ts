import type { CorsairErrorHandler } from 'corsair/core';
import { SupersaasAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SupersaasAPIError ? error.status : undefined;
}

/**
 * SuperSaaS answers every failure as **plain text**, not JSON: a bad key is the
 * literal `HTTP Basic: Access denied.` with a 401.
 *
 * SuperSaaS documents no rate limit, so a 429 comes from a gateway.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// The gateway refused the request before SuperSaaS saw it, so any method
		// is safe to replay.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SupersaasAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 and 403: the account name or API key is wrong.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SupersaasAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such user, booking, slot or schedule.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof SupersaasAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: a field failed validation, such as an invalid email address or a
	// booking outside the schedule's window. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. A write may already have landed, and a
	// replayed booking create could double-book the same time.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SupersaasAPIError &&
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
