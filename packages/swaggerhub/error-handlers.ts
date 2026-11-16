import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SwaggerhubAPIError } from './client';

/** HTTP failures arrive as core's `ApiError`; network failures as `SwaggerhubAPIError`. */
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof SwaggerhubAPIError) {
		return error.status;
	}
	return undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request?.method;
	if (error instanceof SwaggerhubAPIError) return error.method;
	return undefined;
}

/**
 * SwaggerHub answers a real HTTP status with `{ code, message }`. The documented
 * classes are 400 for a definition or parameter it rejected, 401 for a missing
 * or bad key, 403 for a permission the account lacks or a plan limit, 404 for an
 * owner, API or version that does not exist, 409 for a name that is taken or a
 * published version, and 415 for a body with a media type the route does not
 * take.
 *
 * This plugin has real writes, so a 5xx is only replayed for a `GET`: a save that
 * timed out may have committed.
 */
export const errorHandlers = {
	// Core's request() already retries a 429 three times and honours
	// Retry-After (R8), so the handler does not retry again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError || error instanceof SwaggerhubAPIError
					? error.retryAfter
					: undefined,
		}),
	},
	// 401 is a wrong key; 403 is a permission or a plan limit, which a retry
	// cannot change.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 is an owner, API or version that does not exist. It is terminal.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a definition or parameter SwaggerHub rejected, and 415 is a media
	// type it does not take, so the same body fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 415;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 is a name that already exists or a published version that cannot be
	// overwritten. Sending the same request again answers the same conflict.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached the registry, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
