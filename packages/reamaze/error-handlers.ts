import type { CorsairErrorHandler } from 'corsair/core';
import { ReamazeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ReamazeAPIError ? error.status : undefined;
}

/**
 * Re:amaze answers with a real HTTP status. Errors are `{ error: "..." }` or
 * `{ message: "..." }`, and a 422 adds per-field detail. A route that does not
 * exist answers an HTML page rather than JSON, so a failure can arrive with a
 * body the parser cannot read; the status still classifies it.
 *
 * Rate limiting is per API token. This plugin has real writes (`POST`, `PUT`,
 * `DELETE`), so a 5xx is only replayed for a `GET`: a create that timed out may
 * have committed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ReamazeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a wrong email or token; 403 is a user whose role lacks the permission
	// the route needs, such as access_reports on the satisfaction ratings.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ReamazeAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is a slug, id or route that does not exist. It is terminal: the same
	// request returns the same answer.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof ReamazeAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 is a field Re:amaze rejected, so the same body fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof ReamazeAPIError && error.isUnprocessable)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached the brand, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ReamazeAPIError &&
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
