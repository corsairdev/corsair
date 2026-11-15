import type { CorsairErrorHandler } from 'corsair/core';
import { SupportbeeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SupportbeeAPIError ? error.status : undefined;
}

/**
 * SupportBee answers with a real HTTP status: 400 for a validation failure, 401
 * or 403 for a rejected token, 404 for a missing ticket or route, and 429 when
 * the rate limit is hit. An unknown route answers the desk's HTML page, so a
 * failure can arrive with a body the parser cannot read; the status still
 * classifies it.
 *
 * This plugin has real writes, so a 5xx is only replayed for a `GET`: a create
 * that timed out may have committed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SupportbeeAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a missing or wrong token; 403 is a user whose role lacks the
	// permission the route needs, such as an admin-only snippet or filter.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SupportbeeAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an id or route that does not exist. It is terminal: the same
	// request returns the same answer.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof SupportbeeAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a field SupportBee rejected, so the same body fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached the desk, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SupportbeeAPIError &&
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
