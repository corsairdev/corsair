import type { CorsairErrorHandler } from 'corsair/core';
import { SuitedashAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SuitedashAPIError ? error.status : undefined;
}

/**
 * SuiteDash reports every failure inside the envelope `{ success: false,
 * message, data: [] }`, including a 200 for some business errors, so the client
 * turns that into an error before this map sees it.
 *
 * Call limits are monthly and plan-based: 80 on trial, 400 on Start, 2000 on
 * Thrive, 20000 on Pinnacle. A 429 is therefore an exhausted allowance, not a
 * throughput limit, so it is never retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof SuitedashAPIError && error.isQuotaExhausted,
		// The plan's monthly calls are used up; retrying cannot succeed and would
		// only spend more of the allowance once it resets.
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 and 403: the Public ID or Secret Key is missing or not valid, which
	// SuiteDash names in the message.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SuitedashAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such company, contact or project. 400, 405 and 422: a malformed
	// request or a field that failed validation. None improves on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 405 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. A write may already have landed, and
	// spending another call from a monthly allowance makes that expensive.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SuitedashAPIError &&
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
