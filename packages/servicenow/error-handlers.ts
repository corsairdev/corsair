import type { CorsairErrorHandler } from 'corsair/core';
import { ServicenowAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ServicenowAPIError ? error.status : undefined;
}

/**
 * ServiceNow answers with a real HTTP status and `{ error: { message, detail },
 * status: 'failure' }`. The Table API does not document a rate limit, but a
 * gateway in front of an instance can add a 429 or a 5xx.
 *
 * This plugin has real writes (`POST`, `PATCH`, `DELETE`), so a 5xx is only
 * replayed for a `GET`: a create that timed out may have committed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ServicenowAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a wrong username or password; 403 is a user without the table role.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ServicenowAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 on the Table API is almost always a table name that does not exist, or
	// a sys_id that was deleted between the read and the write.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof ServicenowAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 405;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached the instance, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ServicenowAPIError &&
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
